"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

/**
 * Comparativo "hoje x no portal" (briefing B2B §2).
 *
 * A coluna "hoje" **não** leva fundo vermelho: pintar o estado atual do
 * cliente de vermelho é acusação, não argumento, e o §S4 da spec já proíbe
 * isso no comparativo da landing B2C. A diferença entre as colunas vem de
 * peso tipográfico e de um fio de acento na coluna de destino.
 *
 * Nenhum item aqui promete recurso inexistente: fila por veículo, status
 * explícito e histórico são comportamentos do modelo de status
 * (`STATUS_MODEL.md`), não capacidades inventadas.
 */
const pairs = [
  {
    before: "O pedido vive numa conversa que some entre outras cinquenta.",
    after: "Cada pedido é um registro com número, vinculado ao veículo.",
  },
  {
    before: "O comprovante está no celular de quem atendeu naquele dia.",
    after: "Documentos ficam anexados à solicitação, acessíveis para a equipe.",
  },
  {
    before: "Para saber do Detran, alguém precisa ligar e perguntar.",
    after: "O status fica explícito, incluindo quando a espera é do órgão.",
  },
  {
    before: "O mesmo veículo é cobrado duas vezes porque ninguém viu o histórico.",
    after: "O histórico do veículo mostra o que já foi solicitado e pago.",
  },
] as const;

export function BeforeAfter({ id }: { id?: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 bg-bg-subtle py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-[55ch]">
          <h2 className="text-h1 text-text md:text-display">
            O trabalho é o mesmo. O rastro é que muda.
          </h2>
        </div>

        <div
          ref={reveal.ref}
          className={cn(
            "grid gap-px overflow-hidden rounded-xl bg-border lg:grid-cols-2",
            reveal.className,
          )}
        >
          <div className="bg-bg-subtle p-6 lg:p-10">
            <h3 className="mb-6 text-h3 text-text-secondary-strong">
              Hoje, no WhatsApp e na planilha
            </h3>
            <ul className="flex flex-col gap-5">
              {pairs.map((pair) => (
                <li key={pair.before} className="flex gap-3">
                  <X aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
                  <p className="text-body-public text-text-secondary-strong">{pair.before}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Fio de acento no topo: é o que distingue a coluna de destino,
              em vez de um bloco de cor. */}
          <div className="border-t-2 border-action-accent bg-surface p-6 lg:p-10">
            <h3 className="mb-6 flex items-center gap-2 text-h3 text-text">
              No Portal do Parceiro
              <ArrowRight aria-hidden="true" className="h-5 w-5 text-action-accent" />
            </h3>
            <ul className="flex flex-col gap-5">
              {pairs.map((pair) => (
                <li key={pair.after} className="flex gap-3">
                  <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-action-accent" />
                  <p className="text-body-public font-medium text-text">{pair.after}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
