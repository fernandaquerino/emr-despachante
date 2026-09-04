import { Info } from "lucide-react";
import { formatAbsoluteDateTime, formatRelativeTime } from "../../../lib/format";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Data → StaleDataBanner.
 * "Última atualização: {timestamp}. [Atualizar]". Nunca esconder dado
 * desatualizado (UX_RULES.md §1.4) — sempre mostrar timestamp + CTA.
 */
export interface StaleDataBannerProps {
  lastUpdatedAt: Date;
  onRefresh: () => void;
  refreshing?: boolean;
  className?: string;
}

export function StaleDataBanner({
  lastUpdatedAt,
  onRefresh,
  refreshing,
  className,
}: StaleDataBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex h-10 items-center gap-2 rounded-sm bg-status-warning-bg px-4 text-body-sm text-status-warning-fg",
        className,
      )}
    >
      <Info aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1">
        Última atualização:{" "}
        <time dateTime={lastUpdatedAt.toISOString()} title={formatAbsoluteDateTime(lastUpdatedAt)}>
          {formatRelativeTime(lastUpdatedAt)}
        </time>
        .
      </span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-60"
      >
        {refreshing ? "Atualizando…" : "Atualizar"}
      </button>
    </div>
  );
}
