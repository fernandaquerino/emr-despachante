"use client";

import { Barcode, CreditCard, QrCode, ShieldCheck, type LucideIcon } from "lucide-react";
import { MoneyBreakdown, cn } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

/**
 * Condições de pagamento (LANDING_PAGE_SPEC.md §S6).
 *
 * Os métodos aqui são exatamente os de SCREEN_SPECS.md §8 — Pix, boleto e
 * cartão. Não há parcelamento em 12x nem desconto por método nesta copy
 * porque nenhum dos dois existe na documentação do produto (spec §0.1); a
 * copy alternativa está escrita na spec e entra quando o negócio confirmar.
 *
 * A nota informativa ao final não é opcional: é o invariante
 * `checkout success != payment confirmation` (CLAUDE.md §11) dito na camada
 * de marketing. Prometer "aprovação imediata" aqui criaria uma expectativa
 * que o backend intencionalmente não cumpre.
 */
const methods: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: QrCode,
    title: "Pix",
    description: "O caminho mais rápido: a confirmação chega poucos minutos após o pagamento.",
  },
  {
    icon: Barcode,
    title: "Boleto",
    description:
      "Compensação bancária no prazo normal — o pedido segue assim que o banco confirma.",
  },
  {
    icon: CreditCard,
    title: "Cartão",
    description: "Disponível conforme a forma de pagamento habilitada para o serviço.",
  },
];

export function PaymentTerms({ id }: { id?: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 bg-bg-subtle py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <span className="text-label font-medium uppercase tracking-wide text-action-accent">
            Pagamento
          </span>
          <h2 className="mt-3 text-h1 text-text md:text-display">Você vê o valor antes de pagar</h2>
          <p className="mt-3 max-w-[65ch] text-lead text-text-secondary-strong">
            O valor da pendência, a taxa de serviço e o total aparecem no resumo do checkout. Sem
            valor que aparece depois.
          </p>
        </div>

        <div
          ref={reveal.ref}
          className={cn("grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16", reveal.className)}
        >
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {methods.map((method) => (
              <li key={method.title} className="flex items-start gap-4 py-5">
                <method.icon
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-action-accent"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-h4 text-text">{method.title}</h3>
                  <p className="max-w-[55ch] text-body-public text-text-secondary-strong">
                    {method.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="mb-4 text-label font-medium uppercase tracking-wide text-text-secondary-strong">
                Exemplo de resumo no checkout
              </p>
              <MoneyBreakdown
                lines={[
                  { label: "Multa — avanço de sinal", amountCents: 29519 },
                  { label: "Taxa de serviço EMR", amountCents: 4900 },
                ]}
                totalLabel="Total"
                totalCents={34419}
              />
              <p className="mt-4 text-body text-text-secondary-strong">
                Valores de exemplo. O valor real depende do débito do órgão e do serviço escolhido.
              </p>
            </div>

            {/* Sem caixa, de propósito.
                Isto estava como um segundo card branco idêntico ao do resumo,
                com ícone ⓘ e dois parágrafos cinzas de mesmo peso — a forma
                visual de um aviso de sistema descartável. Mas é a frase mais
                importante da página: o invariante `checkout success !=
                payment confirmation` (CLAUDE.md §11) dito ao cliente.
                Duas correções: a afirmação vira o próprio título (ela é a
                mensagem, não a legenda de uma mensagem), e a hierarquia vem
                de tipografia + fio, não de mais um retângulo —
                LANDING_PAGE_SPEC.md §0.5 reserva card para onde a elevação
                comunica hierarquia real. O fio no topo repete a linguagem de
                hairline da coluna da esquerda e amarra a seção. */}
            <aside
              aria-labelledby="payment-confirmation-title"
              className="flex gap-4 border-t-2 border-action-accent pt-6"
            >
              <ShieldCheck
                aria-hidden="true"
                className="mt-1 h-6 w-6 shrink-0 text-action-accent"
              />
              <div className="flex flex-col gap-3">
                <h3
                  id="payment-confirmation-title"
                  className="text-balance text-h2 text-text md:text-h1"
                >
                  O status do pedido muda só após a confirmação oficial do pagamento.
                </h3>
                <p className="max-w-[46ch] text-pretty text-body-public text-text-secondary-strong">
                  Começar o checkout, por si só, não confirma o pagamento. A gente nunca marca como
                  pago antes do retorno do provedor.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
