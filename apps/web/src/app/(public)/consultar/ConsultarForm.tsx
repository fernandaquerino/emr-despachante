"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button } from "@emr/ui";
import { ConsultErrorSummary } from "../_components/consult/ConsultErrorSummary";
import { ConsultFeedback } from "../_components/consult/ConsultFeedback";
import { PlateField } from "../_components/consult/PlateField";
import { RenavamField } from "../_components/consult/RenavamField";
import { useVehicleConsult } from "../_components/consult/use-vehicle-consult";

/**
 * Formulário da rota `/consultar`. Toda a máquina de estados vive em
 * `useVehicleConsult`, compartilhada com o widget da landing — aqui fica só a
 * apresentação e a decisão de para onde ir no sucesso.
 *
 * No sucesso, encaminha para `/consultar/:id` (`FE-PUB-003`/#152), a rota de
 * resultado especificada em `EMR-SCREEN-MAP.md` §2.3 e
 * `INFORMATION_ARCHITECTURE.md`. Consulta concluída **não** é atestado de
 * regularidade: esta tela não afirma nada sobre o veículo, só encaminha.
 */
export function ConsultarForm() {
  const router = useRouter();
  const { plate, renavam, state, errors, renavamRequired, setPlate, setRenavam, submit, retry } =
    useVehicleConsult();

  const summaryRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLInputElement>(null);
  const renavamRef = useRef<HTMLInputElement>(null);
  const loading = state.status === "loading";

  // Autofocus só no desktop: no mobile ele abre o teclado e empurra o título
  // para fora da tela (`LANDING_PAGE_SPEC.md` §S1). Media query em vez de
  // `autoFocus`, que não distingue viewport.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      plateRef.current?.focus();
    }
  }, []);

  /**
   * Conta tentativas inválidas em vez de focar direto no `handleSubmit`: o
   * resumo só existe no DOM depois do render que os erros causam, então
   * focá-lo de dentro do handler não acha elemento nenhum.
   */
  const [invalidAttempts, setInvalidAttempts] = useState(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submit()) {
      setInvalidAttempts((count) => count + 1);
    }
  }

  // Foco no resumo, não no campo: quem submeteu com o foco no botão não ouve
  // um erro que apareceu acima dele (`UX_RULES.md` §5).
  useEffect(() => {
    if (invalidAttempts > 0) {
      summaryRef.current?.focus();
    }
  }, [invalidAttempts]);

  // Quando o backend passa a pedir o RENAVAM, o campo novo recebe o foco —
  // sem isso a pessoa submete e nada parece ter acontecido.
  useEffect(() => {
    if (renavamRequired && renavam.length === 0) {
      renavamRef.current?.focus();
    }
  }, [renavamRequired, renavam.length]);

  useEffect(() => {
    if (state.status === "completed") {
      router.push(`/consultar/${state.result.consultationId}`);
    }
  }, [router, state]);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <ConsultErrorSummary ref={summaryRef} errors={errors} />

        <PlateField
          ref={plateRef}
          value={plate}
          onValueChange={setPlate}
          error={errors.plate}
          disabled={loading}
          className="h-14 border-2 border-border-strong text-center font-mono text-h2 uppercase tracking-[0.12em] placeholder:font-sans placeholder:text-body-public placeholder:normal-case placeholder:tracking-normal placeholder:text-text-muted"
        />

        {renavamRequired ? (
          <div className="flex flex-col gap-3">
            {/* O motivo vem antes do campo: pedir um documento sem explicar por
                quê é o ponto onde a consulta é abandonada. */}
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

        {/* Botão nunca nasce desabilitado: valida no submit e explica o erro
            (`UX_RULES.md` §5). Durante o loading, `Button` já aplica
            `disabled` + `aria-busy`, o que impede submit duplicado. */}
        <Button type="submit" variant="cta" size="xl" loading={loading} className="w-full">
          {loading ? "Consultando veículo…" : "Consultar veículo"}
        </Button>

        <p className="text-body-public text-text-secondary-strong">
          Em alguns casos o RENAVAM do veículo pode ser solicitado para completar a consulta. Nós
          pedimos só se o órgão precisar.
        </p>
      </form>

      {/* Uma live region para a área toda, não uma por campo
          (`UX_RULES.md` §4). */}
      <div role="status" aria-atomic="true" aria-busy={loading} className="flex flex-col gap-4">
        {loading ? (
          <p className="text-body-public text-text-secondary-strong">
            Consultando a situação do veículo. Isso leva alguns segundos.
          </p>
        ) : null}

        <ConsultFeedback state={state} onRetry={retry} />

        {state.status === "completed" ? (
          <p className="text-body-public text-text-secondary-strong">
            Consulta concluída. Abrindo o resultado…
          </p>
        ) : null}
      </div>
    </div>
  );
}
