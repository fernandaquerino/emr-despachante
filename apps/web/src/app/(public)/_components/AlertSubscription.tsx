"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Checkbox, Input } from "@emr/ui";

/**
 * Captura de contato — aparece **depois** do resultado, nunca antes
 * (LANDING_PAGE_SPEC.md §0.3). O contato é trocado por um benefício
 * concreto (aviso de vencimento), e não é requisito para ver a consulta.
 *
 * LGPD: finalidade declarada no próprio label, consentimento ativo (checkbox
 * nunca pré-marcada) e coleta mínima — um canal de contato, sem CPF, sem
 * nome, sem endereço (RNF-001, SECURITY_AND_LGPD.md).
 *
 * Escopo: não existe endpoint de lead neste repositório. O submit não envia
 * nada — ele apenas confirma na tela, e o `TODO` abaixo é o ponto de ligação.
 */
export function AlertSubscription({ plate }: { plate: string }) {
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (contact.trim().length < 8) {
      setError("Informe um WhatsApp com DDD ou um e-mail válido.");
      return;
    }
    if (!consent) {
      setError("Precisamos da sua autorização para enviar os avisos.");
      return;
    }

    setError(undefined);
    // TODO(FE-PUB-002): POST para o endpoint de lead quando existir. Até
    // então nada sai do navegador — nenhum dado é persistido ou enviado.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Alert
        tone="success"
        title="Alertas ativados para esta placa."
        description={`Vamos avisar em ${contact} antes dos próximos vencimentos de ${plate}. Você pode cancelar quando quiser.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div>
        <p className="text-body font-medium text-text">Quer ser avisado antes de vencer?</p>
        <p className="text-body-public text-text-secondary-strong">
          Avisamos quando aparece multa nova e quando um prazo está perto do fim.
        </p>
      </div>

      <Input
        label="WhatsApp ou e-mail"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
        error={error && contact.trim().length < 8 ? error : undefined}
        autoComplete="email"
        placeholder="(11) 90000-0000"
      />

      <Checkbox
        checked={consent}
        onCheckedChange={(value) => setConsent(value === true)}
        label="Autorizo a EMR a me enviar avisos sobre este veículo."
        className="shrink-0"
      />

      {error && contact.trim().length >= 8 ? (
        <p role="alert" className="text-body-public text-status-error-fg">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="secondary" className="self-start">
        Ativar alertas
      </Button>
    </form>
  );
}
