import { formatCentsToBRL } from "../../../lib/format";
import { cn } from "../../../lib/cn";

/**
 * `MoneyBreakdown` não está nomeado em docs/design-system/DOMAIN_COMPONENTS.md
 * — o mais próximo é o bloco de valor de `PaymentSummary` (§5). Reaproveito
 * suas regras: números tabulares (`.numeric-tabular`, ver base.css), formato
 * PT-BR, e nunca colorir o valor por semântica de status (checklist de
 * DOMAIN_COMPONENTS.md).
 */
export interface MoneyBreakdownLine {
  label: string;
  amountCents: number;
}

export interface MoneyBreakdownProps {
  lines: MoneyBreakdownLine[];
  totalLabel?: string;
  totalCents: number;
  className?: string;
}

export function MoneyBreakdown({
  lines,
  totalLabel = "Total",
  totalCents,
  className,
}: MoneyBreakdownProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ul className="flex flex-col gap-1.5">
        {lines.map((line) => (
          <li key={line.label} className="flex justify-between text-body-sm text-text-secondary">
            <span>{line.label}</span>
            <span className="numeric-tabular">{formatCentsToBRL(line.amountCents)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-border pt-2 text-body font-semibold text-text">
        <span>{totalLabel}</span>
        <span className="text-kpi numeric-tabular">{formatCentsToBRL(totalCents)}</span>
      </div>
    </div>
  );
}
