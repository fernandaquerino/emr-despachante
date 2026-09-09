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
        "relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary",
        "hover:bg-bg-subtle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
      {badge ? (
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-status-error"
        />
      ) : null}
    </button>
  );
}
