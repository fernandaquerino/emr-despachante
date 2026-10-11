"use client";

import { Check, X } from "lucide-react";
import { cn } from "@emr/ui";
import { Container } from "./Container";
import { useReveal } from "./lib/use-reveal";

export interface PainSolutionPair {
  pain: string;
  solution: string;
}

/**
 * Comparativo burocracia × plataforma (LANDING_PAGE_SPEC.md §S4).
 *
 * Zigue-zague de duas colunas separado por `border-t`, não três cards iguais.
 * A coluna da dor se diferencia por peso e cor de texto — nunca por fundo
 * vermelho, que lê como erro do sistema em vez de contexto.
 */
export function PainSolution({ id, pairs }: { id?: string; pairs: readonly PainSolutionPair[] }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-2xl">
          <h2 className="text-h1 text-text md:text-display">
            A papelada não mudou. A forma de resolver, sim.
          </h2>
        </div>

        <div ref={reveal.ref} className={cn("flex flex-col", reveal.className)}>
          {pairs.map((pair, index) => (
            <div
              key={pair.pain}
              className={cn(
                "grid gap-6 border-t border-border py-8 lg:grid-cols-2 lg:gap-16 lg:py-10",
                index === pairs.length - 1 && "border-b",
              )}
            >
              <div
                className={cn(
                  "flex items-start gap-3",
                  // Alterna o lado do par no desktop para quebrar a leitura em
                  // duas colunas rígidas.
                  index % 2 === 1 && "lg:order-2",
                )}
              >
                <X aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-status-error" />
                <p className="text-lead text-text-secondary-strong">{pair.pain}</p>
              </div>
              <div className={cn("flex items-start gap-3", index % 2 === 1 && "lg:order-1")}>
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-status-success" />
                <p className="text-lead font-semibold text-text">{pair.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
