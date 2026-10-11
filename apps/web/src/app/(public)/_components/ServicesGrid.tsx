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

export interface ServicesGridItem {
  /** Chave de `iconRegistry` — componentes de ícone não podem vir de um Server Component (ver icon-registry.ts). */
  icon: IconKey;
  title: string;
  description: string;
}

export interface ServicesGridProps {
  id?: string;
  /** Opcional: a regra de ritmo da área pública limita eyebrow a 1 a cada 3 seções. */
  eyebrow?: string;
  title: string;
  description: string;
  items: readonly ServicesGridItem[];
  tone?: "default" | "subtle";
  /** Quando informado, cada card ganha uma chamada de ação que rola até essa âncora (ex.: `#consulta`). Omitido em contextos sem consulta funcional (ex.: `/parceiros`). */
  actionHref?: string;
  actionLabel?: string;
}

/**
 * Resolve a forma da grade a partir da QUANTIDADE de itens.
 *
 * O bento destacava o primeiro item em 2 colunas de 3 de forma fixa. Isso só
 * fecha a grade quando `n + 1` é divisível por 3, ou seja, 5 ou 8 itens. Com
 * 3 itens sobravam duas células vazias na segunda linha, e com 4 sobrava uma
 * (a `/parceiros` conviveu com esse buraco antes de alguém reparar).
 *
 * A ordem de preferência é deliberada:
 *   1. destaque em 2 colunas, se isso fechar a grade (gera hierarquia);
 *   2. grade uniforme, se fechar;
 *   3. 3 colunas como último recurso.
 *
 * Nunca cai em "3 cards idênticos lado a lado" para 3 itens: com `n = 3` a
 * primeira regra já resolve em 2 colunas, com o destaque ocupando a linha
 * inteira e os outros dois dividindo a linha de baixo.
 */
export function resolveServicesGrid(count: number): {
  columns: 2 | 3;
  featureSpansTwo: boolean;
} {
  for (const columns of [3, 2] as const) {
    if ((count + 1) % columns === 0) return { columns, featureSpansTwo: true };
  }
  for (const columns of [3, 2] as const) {
    if (count % columns === 0) return { columns, featureSpansTwo: false };
  }
  return { columns: 3, featureSpansTwo: false };
}

/**
 * Bento grid de serviços (ui-ux-pro-max: padrão "Bento Grid Showcase"), com
 * a forma derivada da quantidade de itens — ver `resolveServicesGrid`.
 */
export function ServicesGrid({
  id,
  eyebrow,
  title,
  description,
  items,
  tone = "default",
  actionHref,
  actionLabel = "Consultar",
}: ServicesGridProps) {
  const reveal = useReveal<HTMLDivElement>();
  const { columns, featureSpansTwo } = resolveServicesGrid(items.length);

  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 lg:py-28", tone === "subtle" && "bg-bg-subtle")}
    >
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
            "grid grid-cols-1 gap-4 sm:grid-cols-2",
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2",
            reveal.className,
          )}
        >
          {items.map((item, index) => {
            const Icon = iconRegistry[item.icon];
            const featured = index === 0 && featureSpansTwo;

            return (
              <div
                key={item.title}
                className={cn(
                  "group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-elev1 transition-all duration-normal ease-standard",
                  "hover:-translate-y-0.5 hover:border-action-accent hover:shadow-elev2",
                  featured && "sm:col-span-2 lg:flex-row lg:items-start lg:gap-6 lg:p-8",
                )}
              >
                {/* Ícone colorido por serviço usando a paleta categórica
                    (`--data-1..6`), que existe justamente para distinguir
                    categorias sem carregar semântica de status. Pintar com
                    `--status-*` daria a entender que "Multas" é um estado de
                    erro. */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-subtle transition-transform duration-normal ease-standard group-hover:scale-105",
                    featured && "h-14 w-14",
                  )}
                  style={{ color: `var(--data-${ICON_TONES[index % ICON_TONES.length]})` }}
                >
                  <Icon aria-hidden="true" className={cn("h-6 w-6", featured && "h-7 w-7")} />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h3 className={cn("text-h4 text-text", featured && "text-h3")}>{item.title}</h3>
                  <p
                    className={cn(
                      "text-body-public text-text-secondary-strong",
                      featured && "max-w-md text-lead",
                    )}
                  >
                    {item.description}
                  </p>

                  {actionHref ? (
                    <a
                      href={actionHref}
                      className="mt-1 inline-flex items-center gap-1 self-start rounded-sm text-body-public font-semibold text-text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                      {actionLabel}
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
