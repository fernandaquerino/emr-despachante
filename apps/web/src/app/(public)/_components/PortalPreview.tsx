"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@emr/ui";
import { Container } from "./Container";
import {
  DocumentsTeamPanel,
  NewRequestPanel,
  OverviewPanel,
  RequestsPanel,
  TrackingPanel,
} from "./PortalPanels";
import { useReveal } from "./lib/use-reveal";

/**
 * Prévia do Portal do Parceiro (briefing B2B §3).
 *
 * O indicador da aba ativa usa `layoutId` porque a barra precisa *viajar*
 * entre triggers de larguras diferentes, o que CSS não resolve. É a única
 * animação da seção, e ela comunica mudança de estado.
 */
const tabs = [
  {
    value: "visao-geral",
    label: "Visão geral",
    copy: "O que está em andamento, o que trava em órgão e o que depende de você, na primeira tela.",
    Panel: OverviewPanel,
  },
  {
    value: "solicitacoes",
    label: "Solicitações",
    copy: "Busca por placa ou número, com filtro por status e serviço. Toda a operação numa lista só.",
    Panel: RequestsPanel,
  },
  {
    value: "nova",
    label: "Nova solicitação",
    copy: "Veículo, serviço, documentos, observação e revisão. No fim, a solicitação ganha número.",
    Panel: NewRequestPanel,
  },
  {
    value: "acompanhamento",
    label: "Acompanhamento",
    copy: "A linha do tempo mostra o que aconteceu e o que falta, sem jargão interno.",
    Panel: TrackingPanel,
  },
  {
    value: "documentos",
    label: "Documentos e equipe",
    copy: "Pendências de envio num lugar só, e controle de quem da sua empresa acessa o quê.",
    Panel: DocumentsTeamPanel,
  },
] as const;

export function PortalPreview({ id }: { id?: string }) {
  const [active, setActive] = useState<string>(tabs[0].value);
  const reveal = useReveal<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  const activeTab = tabs.find((tab) => tab.value === active) ?? tabs[0];

  return (
    <section id={id} className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div className="mb-10 max-w-[55ch]">
          <h2 className="text-h1 text-text md:text-display">
            É assim que a operação fica depois de entrar.
          </h2>
          <p className="mt-3 text-lead text-text-secondary-strong">
            Prévia do portal, montada com os componentes do próprio produto.
          </p>
        </div>

        <div ref={reveal.ref} className={cn(reveal.className)}>
          <Tabs value={active} onValueChange={setActive}>
            {/* Scroll horizontal em telas estreitas: 5 abas não cabem em
                360px, e Drawer para 5 itens é peso desnecessário. */}
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
                      layoutId="portal-tab-indicator"
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

            <p className="max-w-[60ch] pt-6 text-lead text-text">{activeTab.copy}</p>

            <div className="pt-6">
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <BrowserFrame title={tab.label}>
                    <tab.Panel />
                  </BrowserFrame>
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
 * Moldura de janela de navegador. Totalmente `aria-hidden`: ela não
 * comunica nada, quem comunica é o painel dentro dela.
 */
function BrowserFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-elev3">
      <div
        aria-hidden="true"
        className="flex items-center gap-2 border-b border-border-subtle bg-bg-subtle px-4 py-3"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        <span className="ml-3 flex-1 truncate rounded-sm bg-surface px-3 py-1 text-body text-text-muted">
          portal.emrdespachantes.com.br · {title}
        </span>
      </div>
      <div className="overflow-x-auto p-5 lg:p-8">{children}</div>
    </div>
  );
}
