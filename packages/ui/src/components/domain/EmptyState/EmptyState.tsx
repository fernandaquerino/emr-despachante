import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Data → EmptyState.
 * Ícone 32px + título H3 + descrição + CTA opcional. Nunca "Nada aqui."
 * isolado (UX_RULES.md §3).
 */
export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1 py-8 text-center", className)}>
      <Icon aria-hidden="true" className="h-8 w-8 text-text-muted" />
      <h3 className="mt-2 text-h4 text-text">{title}</h3>
      {description ? <p className="text-body-sm text-text-secondary">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
