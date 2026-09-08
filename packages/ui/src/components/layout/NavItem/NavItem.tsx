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
        "flex items-center gap-3 rounded-md border-l-transparent px-3 py-2",
        "text-body text-text-secondary transition-colors duration-fast ease-standard",
        "hover:bg-bg-subtle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        isActive &&
          "border-l-action-accent bg-surface-selected text-text-link hover:bg-surface-selected",
        collapsed && "justify-center px-2",
        className,
      )}
    >
      <Icon aria-hidden="true" className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge ? (
        <span className="flex items-center ml-auto shrink-0">{badge}</span>
      ) : null}
    </Link>
  );
}
