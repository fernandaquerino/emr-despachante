import { Search } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Placeholder visual para a busca global do header (300–480px,
 * docs/design-system/COMPONENTS.md §Navigation → Header). Sem estado de
 * busca — funcional fica fora do escopo desta issue.
 */
export interface SearchPlaceholderProps {
  placeholder?: string;
  onClick?: () => void;
  className?: string;
}

export function SearchPlaceholder({
  placeholder = "Buscar",
  onClick,
  className,
}: SearchPlaceholderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 w-full max-w-[480px] items-center gap-2 rounded-md border border-border bg-bg-subtle px-3 text-body-sm text-text-muted",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1",
        className,
      )}
    >
      <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="truncate">{placeholder}</span>
    </button>
  );
}
