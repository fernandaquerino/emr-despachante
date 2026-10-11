"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Accordion. Padrão disclosure
 * (WAI-ARIA): trigger com `aria-expanded`/`aria-controls`, painel com
 * `role="region"`/`aria-labelledby`. Altura anima via `grid-template-rows`
 * (0fr → 1fr) para não depender de medir pixels em runtime; `base.css` já
 * zera a transição sob `prefers-reduced-motion`.
 */
export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Um item aberto por vez (comportamento de FAQ). Nenhum se omitido. */
  defaultOpenId?: string;
  /**
   * `lg` sobe pergunta e resposta um step e reforça o contraste do corpo.
   * Para a área pública, onde 14px é piso ruim de leitura; o app segue em
   * `md`, que é a densidade de painel.
   */
  size?: "md" | "lg";
  className?: string;
}

export function Accordion({ items, defaultOpenId, size = "md", className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          size={size}
          open={openId === item.id}
          onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
        />
      ))}
    </div>
  );
}

function AccordionRow({
  item,
  size,
  open,
  onToggle,
}: {
  item: AccordionItem;
  size: "md" | "lg";
  open: boolean;
  onToggle: () => void;
}) {
  const generatedId = useId();
  const buttonId = `${generatedId}-trigger`;
  const panelId = `${generatedId}-panel`;

  return (
    <div className={cn(size === "lg" ? "py-6" : "py-5")}>
      <h3 className={cn(size === "lg" ? "text-h3" : "text-h4")}>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-sm text-left transition-colors duration-fast ease-standard",
            size === "lg" ? "text-h3" : "text-h4",
            open ? "text-action-accent" : "text-text hover:text-action-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
          )}
        >
          <span>{item.question}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-normal ease-standard",
              open ? "rotate-180 text-action-accent" : "text-text-muted",
            )}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-normal ease-standard"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "pt-3",
              size === "lg"
                ? "text-body-public text-text-secondary-strong"
                : "text-body text-text-secondary",
            )}
          >
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}
