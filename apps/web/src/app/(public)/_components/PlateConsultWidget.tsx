"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert, Badge, Button, LoadingState } from "@emr/ui";
import { ConsultResult } from "./ConsultResult";
import { ConsultErrorSummary } from "./consult/ConsultErrorSummary";
import { ConsultFeedback } from "./consult/ConsultFeedback";
import { PlateField } from "./consult/PlateField";
import { RenavamField } from "./consult/RenavamField";
import { useVehicleConsult } from "./consult/use-vehicle-consult";
import { formatPlateForDisplay } from "../../../lib/plate";
import { Car, Lock } from "lucide-react";

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
 * antes (ver `AlertSubscription`). O RENAVAM aparece só se o órgão pedir.
 *
 * A máquina de estados é a mesma de `/consultar` (`useVehicleConsult`), mas a
 * apresentação é diferente de propósito: aqui o resultado é renderizado
 * **in-place**, dentro deste cartão, conforme a decisão registrada em
 * `LANDING_PAGE_SPEC.md` §Nota S2. Em `/consultar` ele encaminha para
 * `/consultar/:id`.
 */
export function PlateConsultWidget() {
  const {
    plate,
    renavam,
    state,
    errors,
    renavamRequired,
    setPlate,
    setRenavam,
    submit,
    retry,
    reset,
  } = useVehicleConsult();

  const summaryRef = useRef<HTMLDivElement>(null);
  const renavamRef = useRef<HTMLInputElement>(null);
  const loading = state.status === "loading";
  const showForm = state.status !== "completed";

  // Ver `ConsultarForm`: o resumo só está no DOM depois do render dos erros.
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submit()) {
      setInvalidAttempts((count) => count + 1);
    }
  }

  useEffect(() => {
    if (invalidAttempts > 0) {
      summaryRef.current?.focus();
    }
  }, [invalidAttempts]);

  useEffect(() => {
    if (renavamRequired && renavam.length === 0) {
      renavamRef.current?.focus();
    }
  }, [renavamRequired, renavam.length]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-elev3 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-label font-semibold uppercase tracking-wide text-text-secondary-strong">
          Consulta de veículo
        </span>
        <Badge tone="success">Grátis</Badge>
      </div>

      {/* Uma live region por área, não por skeleton (UX_RULES.md §4). */}
      <div aria-live="polite" aria-busy={loading} className="flex flex-col gap-4">
        <ConsultFeedback state={state} onRetry={retry} />

        {loading ? (
          <div className="flex flex-col gap-4">
            <p className="text-body-public text-text-secondary-strong">
              Consultando a situação de{" "}
              <span className="font-mono uppercase">{formatPlateForDisplay(plate)}</span>…
            </p>
            <LoadingState variant="list" count={3} />
          </div>
        ) : null}

        {state.status === "completed" ? (
          <ConsultResult outcome={state.result} onReset={reset} />
        ) : null}
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          className={loading ? "mt-5 flex flex-col gap-5" : "flex flex-col gap-5"}
        >
          <ConsultErrorSummary ref={summaryRef} errors={errors} />

          {/* Campo com cara de placa: alto, monoespaçado e centralizado. O
              ícone saiu de dentro do campo — estava posicionado com um
              `top-[2.1rem]` mágico que quebra assim que a altura muda. */}
          <PlateField
            value={plate}
            onValueChange={setPlate}
            error={errors.plate}
            disabled={loading}
            className="h-16 border-2 border-border-strong text-center font-mono text-display uppercase tracking-[0.12em] placeholder:font-sans placeholder:text-body-public placeholder:normal-case placeholder:tracking-normal placeholder:text-text-muted"
          />

          {renavamRequired ? (
            <div className="flex flex-col gap-3">
              {/* O motivo antes do campo: pedir um documento sem explicar por
                  quê é onde a consulta é abandonada. */}
              <Alert
                tone="info"
                title="Precisamos do RENAVAM para concluir esta consulta."
                description="A base do órgão não identificou o veículo apenas pela placa. O RENAVAM está no documento do veículo (CRLV) e é usado somente nesta consulta."
              />
              <RenavamField
                ref={renavamRef}
                value={renavam}
                onValueChange={setRenavam}
                error={errors.renavam}
                disabled={loading}
              />
            </div>
          ) : null}

          {/* Botão nunca nasce desabilitado: valida no submit e explica o erro.
              Botão cinza sem explicação é o maior ponto de abandono aqui.
              `variant="cta"` é o único da dobra — ver ADR-016. */}
          <Button type="submit" variant="cta" size="xl" loading={loading} className="w-full">
            {loading ? (
              "Consultando veículo…"
            ) : (
              <>
                <Car aria-hidden="true" className="h-5 w-5" />
                Consultar débitos grátis
              </>
            )}
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
