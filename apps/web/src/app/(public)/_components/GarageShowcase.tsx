"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger, buttonVariants, cn } from "@emr/ui";
import { Container } from "./Container";
import { AlertsPanel, DebtsPanel, DocumentsPanel, VehiclesPanel } from "./GaragePanels";
import { useReveal } from "./lib/use-reveal";

/**
 * "Sua Garagem Digital" — demonstração da área logada
 * (LANDING_PAGE_SPEC.md §S3). Herda o mockup de painel que antes decorava o
 * hero: aqui ele é o conteúdo da seção, não um enfeite ao lado do texto.
 *
 * Único lugar da landing com framer-motion além do hero: o indicador da aba
 * ativa usa `layoutId`, que CSS não resolve (a barra precisa *viajar* entre
 * triggers de larguras diferentes). O resto da página continua em CSS via
 * `use-reveal`.
 */
const tabs = [
  {
    value: "veiculos",
    label: "Meus veículos",
    copy: "Toda a sua frota numa tela — placa, modelo e o que precisa de atenção primeiro.",
    Panel: VehiclesPanel,
  },
  {
    value: "debitos",
    label: "Débitos e prazos",
    copy: "Multas, licenciamento e IPVA com valor e vencimento. O que vence antes aparece antes.",
    Panel: DebtsPanel,
  },
  {
    value: "documentos",
    label: "Documentos",
    // Copy deliberadamente sem "CRLV-e": RF-023 é "CRLV simulado". Trocar só
    // quando a emissão real existir (LANDING_PAGE_SPEC.md §S3).
    copy: "Comprovantes de pagamento e histórico do veículo, com download autorizado só para você.",
    Panel: DocumentsPanel,
  },
  {
    value: "alertas",
    label: "Alertas",
    copy: "Avisamos antes de vencer: multa nova, prazo de licenciamento e pagamento pendente.",
    Panel: AlertsPanel,
  },
] as const;

export function GarageShowcase({ id }: { id?: string }) {
  const [active, setActive] = useState<string>(tabs[0].value);
  const reveal = useReveal<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  const activeTab = tabs.find((tab) => tab.value === active) ?? tabs[0];

  return (
    <section id={id} className="scroll-mt-20 bg-bg-subtle py-20 lg:py-28">
      <Container>
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <span className="text-label font-medium uppercase tracking-wide text-action-accent">
            Sua garagem digital
          </span>
          <h2 className="text-h1 text-text md:text-display">
            Todos os seus veículos num painel que não te deixa esquecer nada.
          </h2>
          <p className="max-w-[65ch] text-lead text-text-secondary-strong">
            Cadastre seus carros uma vez. A partir daí você vê o que está em aberto, recebe aviso
            antes de cada vencimento e baixa seus comprovantes quando quiser.
          </p>
        </div>

        <div ref={reveal.ref} className={cn(reveal.className)}>
          <Tabs value={active} onValueChange={setActive}>
            {/* Scroll horizontal em telas estreitas: 4 abas não cabem em 360px,
                e Drawer para 4 itens é peso desnecessário. */}
            <TabsList className="-mx-5 flex-nowrap overflow-x-auto px-5 lg:mx-0 lg:px-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative shrink-0 border-b-0 data-[state=active]:border-b-0"
                >
                  {tab.label}
                  {active === tab.value ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId="garage-tab-indicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-action-accent"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 100, damping: 20 }
                      }
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="grid gap-8 pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
              <div className="flex flex-col gap-5">
                <p className="max-w-[48ch] text-lead text-text">{activeTab.copy}</p>
                <Link
                  href="/cadastro"
                  className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "self-start")}
                >
                  Criar minha garagem
                </Link>
                <p className="text-body text-text-secondary-strong">
                  Criar conta, cadastrar veículos e receber alertas não têm custo.
                </p>
              </div>

              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="lg:col-start-2 lg:row-start-1"
                >
                  <PhoneFrame title={tab.label}>
                    <tab.Panel />
                  </PhoneFrame>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </Container>
    </section>
  );
}

/**
 * Moldura de celular do mockup. O conteúdo dentro são componentes reais do
 * Design System (`StatusBadge`, `MoneyBreakdown`, `Timeline`), não retângulos
 * simulando um print — é um preview de verdade, em escala de app.
 *
 * Toda a moldura é `aria-hidden`: ela não comunica nada: quem comunica é o
 * painel lá dentro.
 */
function PhoneFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="rounded-[2.75rem] border-[10px] border-surface-inverse bg-surface shadow-elev3">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-surface-inverse"
          />
          <div className="flex items-center justify-center border-b border-border-subtle bg-bg-subtle px-5 pb-3 pt-9">
            <span className="text-label font-semibold uppercase tracking-wide text-text-secondary-strong">
              {title}
            </span>
          </div>
          <div className="min-h-[19rem] px-4 py-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
