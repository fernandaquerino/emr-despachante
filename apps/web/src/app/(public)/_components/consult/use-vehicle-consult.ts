"use client";

import { useCallback, useRef, useState } from "react";
import { isValidPlate, normalizePlate } from "../../../../lib/plate";
import { isValidRenavam, normalizeRenavam, toCanonicalRenavam } from "../../../../lib/renavam";
import { lookupVehicle, type ConsultOutcome } from "../../../../lib/consult";

/**
 * Máquina de estados da consulta por placa, compartilhada pelo widget da
 * landing e pela rota `/consultar`.
 *
 * Um estado por vez, nunca booleanos paralelos (`isLoading` + `hasError` +
 * `notFound` se contradizem na terceira combinação). `validationErrors` é o
 * único dado fora da união porque convive com qualquer estado: o usuário pode
 * corrigir a placa enquanto o resultado anterior ainda está na tela.
 *
 * O hook **não navega e não renderiza**: devolve estado. É isso que permite a
 * landing mostrar o resultado in-place (`LANDING_PAGE_SPEC.md` §S2) e
 * `/consultar` redirecionar para `/consultar/:id` usando a mesma lógica.
 */

export type ConsultStatus =
  | "idle"
  | "loading"
  | "renavam_required"
  | "not_found"
  | "rate_limited"
  | "unavailable"
  | "completed";

export type ConsultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "renavam_required" }
  | { status: "not_found" }
  | { status: "rate_limited" }
  | { status: "unavailable" }
  | { status: "completed"; result: Extract<ConsultOutcome, { status: "completed" }> };

export interface ConsultFieldErrors {
  plate?: string;
  renavam?: string;
}

export const PLATE_ERROR = "Placa inválida. Use ABC-1234 ou ABC1D23.";
export const PLATE_REQUIRED_ERROR = "Informe a placa do veículo.";
export const RENAVAM_ERROR = "RENAVAM inválido. Informe os 11 dígitos.";
export const RENAVAM_REQUIRED_ERROR = "Informe o RENAVAM para concluir a consulta.";

export function useVehicleConsult() {
  const [plate, setPlateState] = useState("");
  const [renavam, setRenavamState] = useState("");
  const [state, setState] = useState<ConsultState>({ status: "idle" });
  const [errors, setErrors] = useState<ConsultFieldErrors>({});
  /**
   * Pegajoso de propósito: uma vez que o servidor pediu o RENAVAM, o campo
   * fica na tela até o `reset`. Derivar isto de `state.status` faria o campo
   * desaparecer durante o `loading` do reenvio, levando embora o que a pessoa
   * acabou de digitar.
   */
  const [renavamAsked, setRenavamAsked] = useState(false);

  /**
   * Guarda de corrida. O contador identifica a consulta mais recente: uma
   * resposta que chega fora de ordem é descartada em vez de sobrescrever um
   * resultado mais novo. O `AbortController` corta a requisição antiga na rede,
   * para não gastar o rate limit do servidor com resposta que ninguém vai usar.
   */
  const latestRequestId = useRef(0);
  const inFlight = useRef<AbortController | null>(null);

  const setPlate = useCallback((rawValue: string) => {
    setPlateState(normalizePlate(rawValue));
    setErrors((current) => ({ ...current, plate: undefined }));
  }, []);

  const setRenavam = useCallback((rawValue: string) => {
    setRenavamState(normalizeRenavam(rawValue));
    setErrors((current) => ({ ...current, renavam: undefined }));
  }, []);

  const run = useCallback(
    async (nextPlate: string, nextRenavam: string, renavamRequired: boolean) => {
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;

      const requestId = latestRequestId.current + 1;
      latestRequestId.current = requestId;

      setState({ status: "loading" });

      let outcome: ConsultOutcome;
      try {
        outcome = await lookupVehicle(
          {
            plate: nextPlate,
            // RENAVAM só sobe quando o servidor pediu — dado sensível que não
            // precisa trafegar não trafega.
            ...(renavamRequired ? { renavam: toCanonicalRenavam(nextRenavam) } : {}),
          },
          { signal: controller.signal },
        );
      } catch {
        // Cancelada por uma consulta mais nova: quem cancelou já definiu o
        // estado. Qualquer coisa escrita aqui seria a corrida de volta.
        if (requestId !== latestRequestId.current) return;
        setState({ status: "unavailable" });
        return;
      }

      if (requestId !== latestRequestId.current) return;

      if (outcome.status === "renavam_required") {
        setRenavamAsked(true);
      }

      setState(
        outcome.status === "completed"
          ? { status: "completed", result: outcome }
          : { status: outcome.status },
      );
    },
    [],
  );

  /**
   * Validação no submit, não por tecla: o campo não acusa erro enquanto a
   * pessoa ainda está digitando (`LANDING_PAGE_SPEC.md` §S1). O botão nunca
   * nasce desabilitado — valida no clique e explica (`UX_RULES.md` §5).
   */
  const submit = useCallback(() => {
    const found: ConsultFieldErrors = {};

    if (plate.length === 0) {
      found.plate = PLATE_REQUIRED_ERROR;
    } else if (!isValidPlate(plate)) {
      found.plate = PLATE_ERROR;
    }

    if (renavamAsked) {
      if (renavam.length === 0) {
        found.renavam = RENAVAM_REQUIRED_ERROR;
      } else if (!isValidRenavam(renavam)) {
        found.renavam = RENAVAM_ERROR;
      }
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      // A API não é chamada com dado inválido.
      return false;
    }

    void run(plate, renavam, renavamAsked);
    return true;
  }, [plate, renavam, renavamAsked, run]);

  /** Nova tentativa do mesmo dado — usada por `not_found`/`unavailable`/`rate_limited`. */
  const retry = useCallback(() => {
    if (!isValidPlate(plate)) return;
    if (renavamAsked && !isValidRenavam(renavam)) return;
    void run(plate, renavam, renavamAsked);
  }, [plate, renavam, renavamAsked, run]);

  const reset = useCallback(() => {
    inFlight.current?.abort();
    latestRequestId.current += 1;
    setPlateState("");
    setRenavamState("");
    setErrors({});
    setRenavamAsked(false);
    setState({ status: "idle" });
  }, []);

  return {
    plate,
    renavam,
    state,
    errors,
    /** `true` desde que o backend pediu o campo adicional até o `reset`. */
    renavamRequired: renavamAsked,
    setPlate,
    setRenavam,
    submit,
    retry,
    reset,
  };
}
