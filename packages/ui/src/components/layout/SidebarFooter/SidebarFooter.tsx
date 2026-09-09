import { Avatar } from "../../base/Avatar";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "../../../lib/cn";

/**
 * Rodapé padrão da Sidebar: "perfil compacto + toggle de tema"
 * (docs/design-system/COMPONENTS.md §Navigation → Sidebar). Composição de
 * `Avatar` + `ThemeToggle` já existentes — quem monta o shell só passa
 * nome/avatar da sessão atual.
 */
export interface SidebarFooterProps {
  name: string;
  avatarSrc?: string;
  collapsed?: boolean;
  className?: string;
}

export function SidebarFooter({
  name,
  avatarSrc,
  collapsed = false,
  className,
}: SidebarFooterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn("flex items-center gap-2 px-3 py-1.5", collapsed && "justify-center px-0")}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />
        {!collapsed ? <span className="truncate text-body-sm text-text">{name}</span> : null}
      </div>
      <ThemeToggle collapsed={collapsed} />
    </div>
  );
}
