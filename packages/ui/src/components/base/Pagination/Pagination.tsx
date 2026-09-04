import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Data → Pagination.
 * `[◀ Anterior] [1] [2] [3] … [n] [Próxima ▶]`. Server-side — só recebe
 * `page`/`pageCount` e emite `onPageChange`.
 */
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(page: number, pageCount: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous: number | undefined;
  for (const current of sorted) {
    if (previous !== undefined && current - previous > 1) {
      result.push("ellipsis");
    }
    result.push(current);
    previous = current;
  }
  return result;
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  const pages = getPageNumbers(page, pageCount);

  return (
    <nav aria-label="Paginação" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-surface disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
      </button>

      {pages.map((entry, index) =>
        entry === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-body-sm text-text-muted"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-label={`Página ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onPageChange(entry)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-sm text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              entry === page
                ? "bg-action-primary text-text-on-primary"
                : "border border-border bg-surface text-text-secondary hover:bg-bg-subtle",
            )}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Próxima página"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-surface disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </nav>
  );
}
