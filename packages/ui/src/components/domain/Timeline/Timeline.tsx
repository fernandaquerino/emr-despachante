import type { ReactNode } from "react";
import { formatAbsoluteDateTime, formatRelativeTime } from "../../../lib/format";
import { EmptyState } from "../EmptyState";
import { LoadingState } from "../LoadingState";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/DOMAIN_COMPONENTS.md §4 (CaseTimeline),
 * generalizada para qualquer feed de eventos. Linha vertical 2px, círculos
 * 12px, mais recente no topo, append-only visualmente (notas nunca
 * editadas — para corrigir, adiciona-se um novo evento).
 */
export interface TimelineEvent {
  id: string;
  title: string;
  description?: ReactNode;
  at: Date;
  /** Nota com fundo destacado (`--bg-subtle`), ex.: nota interna de operador. */
  highlighted?: boolean;
}

export interface TimelineProps {
  events: TimelineEvent[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Timeline({
  events,
  loading,
  emptyMessage = "Ainda não há eventos registrados.",
  className,
}: TimelineProps) {
  if (loading) {
    return <LoadingState variant="list" count={3} className={className} />;
  }

  if (events.length === 0) {
    return <EmptyState title={emptyMessage} className={className} />;
  }

  return (
    <div role="feed" aria-busy={loading || undefined} className={cn("flex flex-col", className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <div
            key={event.id}
            role="article"
            aria-labelledby={`${event.id}-title`}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rounded-full bg-action-accent" aria-hidden="true" />
              {!isLast ? <span className="w-px flex-1 bg-border" aria-hidden="true" /> : null}
            </div>
            <div className={cn("flex flex-col gap-0.5", !isLast && "pb-4")}>
              <div className="flex items-baseline gap-2">
                <span id={`${event.id}-title`} className="text-body-sm font-medium text-text">
                  {event.title}
                </span>
                <time
                  dateTime={event.at.toISOString()}
                  title={formatAbsoluteDateTime(event.at)}
                  className="text-caption text-text-muted"
                >
                  {formatRelativeTime(event.at)}
                </time>
              </div>
              {event.description ? (
                <div
                  className={cn(
                    "text-body-sm text-text-secondary",
                    event.highlighted && "rounded-sm bg-bg-subtle p-2",
                  )}
                >
                  {event.description}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
