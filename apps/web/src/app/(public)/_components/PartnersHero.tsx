"use client";

import { cn } from "@emr/ui";
import { Container } from "./Container";
import { PartnerLeadForm } from "./PartnerLeadForm";
import { Photo } from "./Photo";
import { heroPhotoMaskStyle } from "./lib/hero-photo-mask";
import { useReveal } from "./lib/use-reveal";

/**
 * Dobra de `/parceiros`. Mesma linguagem visual da dobra B2C, composição
 * diferente: lá o ponto de conversão é consultar uma placa, aqui é abrir
 * conversa comercial.
 *
 * Esta dobra ficou para trás quando a `/` foi refeita: ainda tinha o grid
 * quadriculado, a marca d'água gigante do logo, `min-h-[80vh]` (a barra de
 * endereço do iOS entra na conta de `vh` e provoca salto no primeiro scroll)
 * e `var(--cobalt-300)` cru, que viola a regra de só referenciar token
 * semântico. Os quatro saíram.
 */
export function PartnersHero({ phoneNumber }: { phoneNumber?: string }) {
  const eyebrow = useReveal<HTMLSpanElement>({ mode: "onMount" });
  const heading = useReveal<HTMLHeadingElement>({ mode: "onMount", delayMs: 120 });
  const lead = useReveal<HTMLParagraphElement>({ mode: "onMount", delayMs: 220 });
  const form = useReveal<HTMLDivElement>({ mode: "onMount", delayMs: 300 });

  return (
    <section
      id="avaliar"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-hero-public py-16 lg:py-20"
    >
      {/* Camada fotográfica sangrando pela direita, dissolvida por máscara.
          Só a partir de `lg`: abaixo disso não há largura para a foto sem
          empurrar o formulário para fora da primeira tela. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[58%] lg:block"
        style={heroPhotoMaskStyle}
      >
        <Photo name="parceirosHero" fill priority objectPosition="42% 38%" sizes="58vw" />
        <div className="absolute inset-0 bg-surface-inverse-tint" />
      </div>

      <Container className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <span
            ref={eyebrow.ref}
            className={cn(
              "text-label font-semibold uppercase tracking-wide text-text-inverse-highlight",
              eyebrow.className,
            )}
          >
            Para empresas
          </span>
          <h1
            ref={heading.ref}
            className={cn(
              "text-display text-text-inverse md:text-display-marketing",
              heading.className,
            )}
          >
            Sua frota sem burocracia veicular.
          </h1>
          <p
            ref={lead.ref}
            className={cn("max-w-xl text-lead text-text-inverse-secondary", lead.className)}
          >
            Troque os{" "}
            <strong className="font-semibold text-text-inverse-highlight">
              pedidos soltos no WhatsApp
            </strong>{" "}
            por um portal onde sua equipe abre, documenta e acompanha cada solicitação.
          </p>
        </div>

        {/* `relative z-10`: a camada da foto é posicionada e pintaria por
            cima de um irmão estático. */}
        <div ref={form.ref} className={cn("relative z-10", form.className)}>
          <PartnerLeadForm phoneNumber={phoneNumber} />
        </div>
      </Container>
    </section>
  );
}
