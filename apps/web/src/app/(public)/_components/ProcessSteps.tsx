"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@emr/ui";
import { Container } from "./Container";
import { iconRegistry, type IconKey } from "./lib/icon-registry";
import { useReveal } from "./lib/use-reveal";

/**
 * Paleta de ícone por categoria. Usa `--data-*` (paleta categórica do DS)
 * porque ela existe justamente para distinguir categorias sem carregar
 * semântica. `--data-5` (vermelho) fica de fora de propósito: pintar
 * "Dívida ativa" de vermelho faz um serviço do catálogo parecer um estado de
 * erro do sistema.
 */
const ICON_TONES = [1, 2, 3, 4, 6] as const;

export interface ProcessStep {
  icon: IconKey;
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  id?: string;
  /** Opcional: a regra de ritmo da área pública limita eyebrow a 1 a cada 3 seções. */
  eyebrow?: string;
  title: string;
  description: string;
  steps: readonly ProcessStep[];
}

/**
 * Cards conectados por setas (não círculos numerados soltos sobre uma
 * linha) — cada etapa carrega um ícone da própria ação. Empilha
 * naturalmente no mobile. Etapas refletem o lifecycle real de
 * `ServiceRequestStatus` (STATUS_MODEL.md: NEW → IN_PROGRESS →
 * WAITING_* → COMPLETED), não um processo inventado.
 */
export function ProcessSteps({ id, eyebrow, title, description, steps }: ProcessStepsProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div className="mx-auto mb-12 flex max-w-2xl flex-col gap-3 text-center">
          {eyebrow ? (
            <span className="text-label font-semibold uppercase tracking-wide text-action-accent">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="text-h1 text-text md:text-display">{title}</h2>
          <p className="text-lead text-text-secondary-strong">{description}</p>
        </div>

        <div
          ref={reveal.ref}
          className={cn(
            "flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3",
            reveal.className,
          )}
        >
          {steps.map((step, index) => {
            const Icon = iconRegistry[step.icon];
            const isLast = index === steps.length - 1;

            return (
              <div key={step.title} className="flex flex-1 items-center gap-3">
                <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border bg-surface p-6 shadow-elev1 transition-shadow duration-normal ease-standard hover:shadow-elev2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action-primary font-mono text-h3 font-semibold text-text-on-primary">
                      {index + 1}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6"
                      style={{ color: `var(--data-${ICON_TONES[index % ICON_TONES.length]})` }}
                    />
                  </div>
                  <h3 className="text-h4 text-text">{step.title}</h3>
                  <p className="text-body-public text-text-secondary-strong">{step.description}</p>
                </div>

                {!isLast ? (
                  <ChevronRight
                    aria-hidden="true"
                    className="hidden h-6 w-6 shrink-0 text-border-strong lg:block"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
