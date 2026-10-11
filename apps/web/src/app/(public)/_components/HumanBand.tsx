"use client";

import { cn } from "@emr/ui";
import { Container } from "./Container";
import { Photo } from "./Photo";
import { useReveal } from "./lib/use-reveal";

/**
 * Faixa de humanização entre blocos de produto. Existe por dois motivos:
 * quebrar a repetição de layout da página (até aqui são todas grades de card)
 * e colocar uma pessoa na tela — a landing inteira não tinha nenhuma.
 *
 * A fotografia aqui é **ilustrativa** e não acompanha citação, nome nem
 * afirmação de que a pessoa é cliente (ADR-017). O texto fala do serviço, não
 * da pessoa da foto.
 */
export function HumanBand({ id }: { id?: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 bg-bg-subtle py-20 lg:py-28">
      <Container>
        <div
          ref={reveal.ref}
          className={cn(
            "grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16",
            reveal.className,
          )}
        >
          <Photo name="humanizacao" sizes="(max-width: 1024px) 100vw, 55vw" />

          <div className="flex flex-col gap-5">
            <h2 className="text-h1 text-text md:text-display">
              Você não precisa entender de Detran para ficar em dia.
            </h2>
            <p className="max-w-[55ch] text-lead text-text-secondary-strong">
              A parte chata é nossa: entender a pendência, falar com o órgão e acompanhar o retorno.
              A sua parte é digitar a placa e decidir o que quer resolver.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
