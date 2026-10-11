"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@emr/ui";
import { Container } from "./Container";
import { iconRegistry, type IconKey } from "./lib/icon-registry";
import { useReveal } from "./lib/use-reveal";

export interface TrustPoint {
  /** Chave de `iconRegistry` — componentes de ícone não podem vir de um Server Component (ver icon-registry.ts). */
  icon: IconKey;
  text: string;
}

export interface TrustSectionProps {
  id?: string;
  /** Opcional: a regra de ritmo da área pública limita eyebrow a 1 a cada 3 seções. */
  eyebrow?: string;
  title: string;
  description: string;
  points: TrustPoint[];
}

/**
 * Segurança e confiança — um único bloco sólido (borda + radius, não dois
 * blocos de texto soltos): painel de destaque navy + grade de itens de
 * confiança, para dar peso visual condizente com o tema. Motion contido (só
 * entrada única da seção, sem números/depoimentos inventados). Cada ponto
 * precisa ser verificável no repositório; ver comentários nos call sites
 * (page.tsx / parceiros).
 */
export function TrustSection({ id, eyebrow, title, description, points }: TrustSectionProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div
          ref={reveal.ref}
          className={cn(
            "grid overflow-hidden rounded-2xl border border-border lg:grid-cols-[0.9fr_1.1fr]",
            reveal.className,
          )}
        >
          <div className="relative flex flex-col justify-center gap-4 overflow-hidden bg-surface-inverse p-8 lg:p-12">
            <ShieldCheck
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-surface-watermark"
            />
            {eyebrow ? (
              <span className="relative text-label font-semibold uppercase tracking-wide text-text-inverse-highlight">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="relative text-h1 text-text-inverse md:text-display">{title}</h2>
            <p className="relative max-w-sm text-body-public text-text-inverse-secondary">
              {description}
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-6 bg-surface p-8 sm:grid-cols-2 lg:p-12">
            {points.map((point) => {
              const Icon = iconRegistry[point.icon];
              return (
                <div key={point.text} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-action-accent">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <span className="pt-1.5 text-body text-text">{point.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
