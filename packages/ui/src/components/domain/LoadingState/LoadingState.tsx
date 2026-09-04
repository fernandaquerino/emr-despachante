import { cn } from "../../../lib/cn";

/**
 * `LoadingState` não é nomeado em docs/design-system/*, mas implementa o
 * padrão documentado ali: skeleton que casa com o shape do layout final,
 * nunca spinner genérico em lista (UX_RULES.md §3, COMPONENTS.md
 * §Feedback → Skeleton). O container que envolve `LoadingState` é
 * responsável por `aria-busy`/live region — uma por área, não por skeleton
 * (UX_RULES.md §4 Screen reader) — por isso as barras aqui são
 * `aria-hidden`.
 */
export type LoadingStateVariant = "list" | "card" | "table" | "text";

export interface LoadingStateProps {
  variant: LoadingStateVariant;
  /** Linhas (list/table) ou cards repetidos. Ignorado em `text`. */
  count?: number;
  className?: string;
}

function Bar({ width }: { width: string }) {
  return <div className={cn("h-3.5 rounded-xs bg-bg-emphasis", width)} />;
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Bar width="w-3/5" />
          <Bar width="w-2/5" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <Bar width="w-2/5" />
          <Bar width="w-4/5" />
          <Bar width="w-1/3" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-4">
          <Bar width="w-1/6" />
          <Bar width="w-2/6" />
          <Bar width="w-1/6" />
          <Bar width="w-1/6" />
        </div>
      ))}
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Bar width="w-3/5" />
      <Bar width="w-full" />
      <Bar width="w-2/5" />
    </div>
  );
}

export function LoadingState({ variant, count = 3, className }: LoadingStateProps) {
  return (
    <div aria-hidden="true" className={cn(className)}>
      {variant === "list" ? <ListSkeleton count={count} /> : null}
      {variant === "card" ? <CardSkeleton count={count} /> : null}
      {variant === "table" ? <TableSkeleton count={count} /> : null}
      {variant === "text" ? <TextSkeleton /> : null}
    </div>
  );
}
