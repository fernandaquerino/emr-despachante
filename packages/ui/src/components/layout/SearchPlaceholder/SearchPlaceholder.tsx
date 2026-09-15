import { Search } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Placeholder visual para a busca global do header (300–480px,
 * docs/design-system/COMPONENTS.md §Navigation → Header). Tratada como campo
 * de comando: ícone + label + atalho de teclado destacado como chip à
 * direita. Sem estado de busca — funcional fica fora do escopo desta issue.
 */
export interface SearchPlaceholderProps {
  placeholder?: string;
  /** Atalho exibido como chip à direita (ex.: "⌘K"). */
  shortcut?: string;
  onClick?: () => void;
  className?: string;
}

export function SearchPlaceholder({
  placeholder = "Buscar",
  shortcut = "⌘K",
  onClick,
  className,
}: SearchPlaceholderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 w-full max-w-[420px] items-center gap-2 rounded-md border border-border-subtle bg-bg-subtle px-2.5 text-body-sm text-text-muted transition-colors duration-fast ease-standard",
        "hover:border-border hover:text-text-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1",
        className,
      )}
    >
      <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">{placeholder}</span>
      {shortcut ? (
        <kbd
          aria-hidden="true"
          className="shrink-0 rounded border border-border-subtle bg-surface-default px-1.5 py-0.5 font-sans text-caption text-text-disabled"
        >
          {shortcut}
        </kbd>
      ) : null}
    </button>
  );
}
