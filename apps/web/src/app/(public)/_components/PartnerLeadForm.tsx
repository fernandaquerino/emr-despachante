"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Badge, Button, Input, Select, buttonVariants, cn } from "@emr/ui";

/**
 * Captação de parceiro na dobra de `/parceiros`.
 *
 * Por que WhatsApp e não um POST: o endpoint de lead ainda não existe
 * (`TODO(FE-PUB-002)`), e formulário que finge enviar é pior que formulário
 * nenhum. Aqui os campos montam uma mensagem pré-preenchida e abrem o
 * WhatsApp da EMR, então o lead chega de verdade hoje. Quando o endpoint
 * existir, troca-se `handleSubmit` e o resto do componente permanece.
 *
 * O que este componente **nunca** diz: "solicitação enviada", "cadastro
 * realizado". Abrir o WhatsApp não é ter enviado nada, e a página tem teste
 * travando exatamente essa promessa (`parceiros/page.test.tsx`).
 *
 * LGPD: nada é armazenado por nós. Ainda assim o destino dos dados fica
 * escrito na tela antes do envio — o usuário precisa saber que a informação
 * vai para uma conversa de WhatsApp (`SECURITY_AND_LGPD.md`, PII minimizada).
 */
const VOLUME_OPTIONS = [
  { value: "ate-10", label: "Até 10 veículos por mês" },
  { value: "11-50", label: "De 11 a 50 veículos por mês" },
  { value: "51-200", label: "De 51 a 200 veículos por mês" },
  { value: "200-mais", label: "Mais de 200 veículos por mês" },
];

interface FieldErrors {
  empresa?: string;
  responsavel?: string;
  contato?: string;
}

export function PartnerLeadForm({ phoneNumber }: { phoneNumber?: string }) {
  const [empresa, setEmpresa] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [contato, setContato] = useState("");
  const [volume, setVolume] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opening, setOpening] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!empresa.trim()) next.empresa = "Informe o nome da empresa.";
    if (!responsavel.trim()) next.responsavel = "Informe quem podemos procurar.";
    if (!contato.trim()) next.contato = "Informe um WhatsApp ou e-mail para retorno.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || !phoneNumber) return;

    const volumeLabel = VOLUME_OPTIONS.find((option) => option.value === volume)?.label;
    const message = [
      "Olá! Quero avaliar o Portal do Parceiro da EMR.",
      `Empresa: ${empresa.trim()}`,
      `Responsável: ${responsavel.trim()}`,
      `Contato: ${contato.trim()}`,
      volumeLabel ? `Volume: ${volumeLabel}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setOpening(true);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-elev3 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-label font-semibold uppercase tracking-wide text-text-secondary-strong">
          Avaliar o portal
        </span>
        <Badge tone="info">Para empresas</Badge>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Nome da empresa"
          value={empresa}
          onChange={(event) => setEmpresa(event.target.value)}
          error={errors.empresa}
          autoComplete="organization"
        />
        <Input
          label="Responsável"
          value={responsavel}
          onChange={(event) => setResponsavel(event.target.value)}
          error={errors.responsavel}
          autoComplete="name"
        />
        <Input
          label="WhatsApp ou e-mail"
          hint="Por onde devolvemos o contato."
          value={contato}
          onChange={(event) => setContato(event.target.value)}
          error={errors.contato}
          autoComplete="email"
        />
        <Select
          label="Veículos por mês"
          placeholder="Selecione uma faixa (opcional)"
          options={VOLUME_OPTIONS}
          value={volume}
          onValueChange={setVolume}
        />

        {phoneNumber ? (
          <Button type="submit" variant="cta" size="xl" className="w-full" loading={opening}>
            Quero ser uma empresa parceira
          </Button>
        ) : (
          /* Sem número configurado o botão não finge funcionar: vira link
             para o contato comercial. Mesma disciplina do FAB de WhatsApp. */
          <Link
            href="/parceiros/contato"
            className={cn(buttonVariants({ variant: "cta", size: "xl" }), "w-full")}
          >
            Falar com o comercial
          </Link>
        )}

        <p className="flex items-start gap-2 text-body text-text-secondary-strong">
          <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-action-accent" />
          Os dados preenchidos abrem uma conversa no WhatsApp da EMR. Nada é gravado neste site.
        </p>
      </form>
    </div>
  );
}
