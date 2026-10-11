"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants, cn } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

export interface FinalCtaLink {
  label: string;
  href: string;
}

export interface FinalCtaProps {
  id?: string;
  title: string;
  description: string;
  primaryCta: FinalCtaLink;
  /** Ignorado quando `secondarySlot` é informado. */
  secondaryCta?: FinalCtaLink;
  /** Override para uma ação secundária que não é navegação (ex.: `NeutralContactCta` em `/parceiros`). */
  secondarySlot?: ReactNode;
  /** Ex.: "Voltar para pessoa física" em `/parceiros`. */
  tertiaryCta?: FinalCtaLink;
}

/**
 * CTA final — composição própria (divisor entre texto e ações), não um
 * retângulo azul centralizado repetindo o hero.
 *
 * A marca d'água gigante do logo saiu junto com a do hero: ícone vetorial
 * apagado vazando pela borda não agrega informação nem confiança, só ruído.
 */
export function FinalCta({
  id,
  title,
  description,
  primaryCta,
  secondaryCta,
  secondarySlot,
  tertiaryCta,
}: FinalCtaProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="relative overflow-hidden bg-surface-inverse py-20 lg:py-28">
      <Container className="relative">
        <div
          ref={reveal.ref}
          className={cn(
            "flex flex-col gap-8 border-t border-border-inverse pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12",
            reveal.className,
          )}
        >
          <div className="flex max-w-xl flex-col gap-3 text-center lg:text-left">
            <h2 className="text-h1 text-text-inverse md:text-display">{title}</h2>
            <p className="text-lead text-text-inverse-secondary">{description}</p>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryCta.href}
                /* Segundo e último `cta` da página (o outro é o da dobra).
                   Aqui ele não divide viewport com nenhum StatusBadge âmbar —
                   restrição do ADR-016. */
                className={buttonVariants({ variant: "cta", size: "xl" })}
              >
                {primaryCta.label}
              </Link>
              {secondarySlot ??
                (secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "xl" }),
                      "border-border-inverse-strong bg-transparent text-text-inverse hover:bg-surface-on-inverse",
                    )}
                  >
                    {secondaryCta.label}
                  </Link>
                ) : null)}
            </div>
            {tertiaryCta ? (
              <Link
                href={tertiaryCta.href}
                className="rounded-sm text-body-public text-text-inverse-muted underline hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                {tertiaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
