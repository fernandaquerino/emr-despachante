"use client";

import { useState, type FormEvent } from "react";
import { Car, Lock } from "lucide-react";
import { Badge, Button, ErrorState, Input, LoadingState } from "@emr/ui";
import { ConsultResult } from "./ConsultResult";
import { formatPlateForDisplay, isValidPlate, normalizePlate } from "../../../lib/plate";
import { lookupVehicle, type LookupOutcome } from "./lib/vehicle-lookup";

type WidgetState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; outcome: LookupOutcome }
  | { status: "error" };

/**
 * Widget de consulta por placa — o ponto de conversão da página. Vive na
 * dobra principal, como coluna direita do hero (LANDING_PAGE_SPEC.md §0.4):
 * está acima da dobra, mas não embutido na coluna da headline, que era o que
 * prejudicava a hierarquia em FE-PUB-001.
 *
 * Único bloco da landing com elevação real — aqui a elevação comunica
 * hierarquia de fato, em vez de decorar.
 *
 * Um campo obrigatório só (placa). O contato vem depois do resultado, nunca
 * antes (ver `AlertSubscription`).
 */
export function PlateConsultWidget() {
  const [rawValue, setRawValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<WidgetState>({ status: "idle" });

  const valid = isValidPlate(rawValue);
  const showFormatError = touched && rawValue.length > 0 && !valid;

  async function runLookup(plate: string) {
    setState({ status: "loading" });
    try {
      const outcome = await lookupVehicle(plate);
      setState(outcome.kind === "error" ? { status: "error" } : { status: "done", outcome });
    } catch {
      setState({ status: "error" });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (valid) {
      void runLookup(rawValue);
    }
  }

  function reset() {
    setRawValue("");
    setTouched(false);
    setState({ status: "idle" });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-elev3 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-label font-semibold uppercase tracking-wide text-text-secondary-strong">
          Consulta de veículo
        </span>
        <Badge tone="success">Grátis</Badge>
      </div>

      {/* Uma live region por área, não por skeleton (UX_RULES.md §4). */}
      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "error" ? (
          <ErrorState
            context="a situação deste veículo"
            description="A consulta ao órgão não respondeu. Seus dados não foram perdidos."
            onRetry={() => void runLookup(rawValue)}
          />
        ) : null}

        {state.status === "loading" ? (
          <div className="flex flex-col gap-4">
            <p className="text-body-public text-text-secondary-strong">
              Consultando a situação de{" "}
              <span className="font-mono uppercase">{formatPlateForDisplay(rawValue)}</span>…
            </p>
            <LoadingState variant="list" count={3} />
          </div>
        ) : null}

        {state.status === "done" ? <ConsultResult outcome={state.outcome} onReset={reset} /> : null}
      </div>

      {state.status === "idle" ? (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Campo com cara de placa: alto, monoespaçado e centralizado. O
              ícone saiu de dentro do campo — estava posicionado com um
              `top-[2.1rem]` mágico que quebra assim que a altura muda. */}
          <Input
            label="Placa do veículo"
            hint="Placa antiga (ABC-1234) ou Mercosul (ABC1D23)"
            error={showFormatError ? "Placa inválida. Use ABC-1234 ou ABC1D23." : undefined}
            value={formatPlateForDisplay(rawValue)}
            onChange={(event) => setRawValue(normalizePlate(event.target.value))}
            onBlur={() => setTouched(true)}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={8}
            placeholder="ABC-1234"
            className="h-16 border-2 border-border-strong text-center font-mono text-display uppercase tracking-[0.12em] placeholder:font-sans placeholder:text-body-public placeholder:normal-case placeholder:tracking-normal placeholder:text-text-muted"
          />

          {/* Botão nunca nasce desabilitado: valida no submit e explica o erro.
              Botão cinza sem explicação é o maior ponto de abandono aqui.
              `variant="cta"` é o único da dobra — ver ADR-016. */}
          <Button type="submit" variant="cta" size="xl" className="w-full">
            <Car aria-hidden="true" className="h-5 w-5" />
            Consultar débitos grátis
          </Button>

          <p className="flex items-center justify-center gap-2 text-body-public font-medium text-text-secondary-strong">
            <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-action-accent" />
            Sem cadastro · Sem CPF · Grátis
          </p>
        </form>
      ) : null}
    </div>
  );
}
