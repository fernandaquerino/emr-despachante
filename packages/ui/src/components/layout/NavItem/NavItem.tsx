import type { LucideIcon } from "lucide-react";
import { ElementType, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export interface NavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: ReactNode;
  isActive?: boolean;
  collapsed?: boolean;
  linkAs?: ElementType;
  className?: string;
}

export function NavItem({
  label,
  href,
  icon: Icon,
  badge,
  isActive = false,
  collapsed = false,
  linkAs: Link = "a",
  className,
}: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] pl-3.5",
        "text-body-sm text-text-secondary transition-colors duration-fast ease-standard",
        "hover:bg-bg-subtle hover:text-text",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        isActive && "text-text font-medium",
        collapsed && "justify-center px-2",
        className,
      )}
    >
      {/* Indicador de ativo: barra fina de 2px, não um preenchimento de
          bloco — DESIGN_SYSTEM.md §Sidebar. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-action-accent transition-opacity duration-fast ease-standard",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        aria-hidden="true"
        className={cn(
          "h-5 w-5 shrink-0 text-text-muted transition-colors duration-fast ease-standard",
          isActive ? "text-action-accent" : "group-hover:text-text-secondary",
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge ? (
        <span className="ml-auto flex shrink-0 items-center">{badge}</span>
      ) : null}
    </Link>
  );
}
