import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Botão ícone-only para o `Header` (Copilot, notificações). Não implementa
 * nenhuma lógica funcional — quem monta o shell decide o `onClick`
 * (busca/notificações/Copilot são fora do escopo desta issue).
 */
export interface HeaderIconButtonProps {
  icon: LucideIcon;
  label: string;
  badge?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HeaderIconButton({
  icon: Icon,
  label,
  badge = false,
  onClick,
  className,
}: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors duration-fast ease-standard",
        "hover:bg-bg-subtle hover:text-text-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
      {badge ? (
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-status-error ring-2 ring-surface-default"
        />
      ) : null}
    </button>
  );
}
