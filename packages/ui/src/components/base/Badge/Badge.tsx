import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * Pill genérico. Não conhece enums de domínio — `StatusBadge` e
 * `PriorityBadge`-like usages compõem `Badge` com a tabela canônica de
 * `lib/status-map.ts`. Anatomia: docs/design-system/COMPONENTS.md §Status.
 */
const badgeVariants = cva(
  "inline-flex h-5 items-center gap-1 rounded-full border px-2.5 text-label font-medium",
  {
    variants: {
      tone: {
        success: "bg-status-success-bg text-status-success-fg border-status-success-border",
        warning: "bg-status-warning-bg text-status-warning-fg border-status-warning-border",
        error: "bg-status-error-bg text-status-error-fg border-status-error-border",
        info: "bg-status-info-bg text-status-info-fg border-status-info-border",
        processing:
          "bg-status-processing-bg text-status-processing-fg border-status-processing-border",
        neutral: "bg-status-neutral-bg text-status-neutral-fg border-status-neutral-border",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  /** Ícone decorativo à esquerda do label — sempre `aria-hidden`. */
  icon?: LucideIcon;
  /** Gira o ícone (usado para `Loader2` em estados "processando"). */
  iconSpin?: boolean;
  children: ReactNode;
}

export function Badge({ tone, icon: Icon, iconSpin, className, children }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)}>
      {Icon ? (
        <Icon aria-hidden="true" className={cn("h-3 w-3", iconSpin && "animate-spin")} />
      ) : null}
      {children}
    </span>
  );
}
