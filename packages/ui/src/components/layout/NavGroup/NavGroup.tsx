import type { ElementType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";
import { NavItem } from "../NavItem";
import { resolveActiveHref } from "../nav-active";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Sidebar.
 * Um grupo de itens de navegação com título opcional (11px caps
 * `--text-muted`). Calcula qual item está ativo a partir de `activePath`
 * (nunca mais de 1 item ativo — UX_RULES.md §11) e filtra itens `hidden`
 * (ex.: features atrás de flag, como o Financeiro do parceiro).
 */
export interface NavGroupItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: ReactNode;
  hidden?: boolean;
}

export interface NavGroupProps {
  title?: string;
  items: NavGroupItem[];
  activePath?: string;
  collapsed?: boolean;
  linkAs?: ElementType;
  className?: string;
}

export function NavGroup({
  title,
  items,
  activePath,
  collapsed = false,
  linkAs,
  className,
}: NavGroupProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) return null;

  const activeHref = resolveActiveHref(
    visibleItems.map((item) => item.href),
    activePath,
  );

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {title && !collapsed ? (
        <span className="px-3.5 pb-1.5 text-caption font-semibold uppercase tracking-wide text-text-disabled">
          {title}
        </span>
      ) : null}
      {visibleItems.map((item) => (
        <NavItem
          key={item.href}
          label={item.label}
          href={item.href}
          icon={item.icon}
          badge={item.badge}
          isActive={item.href === activeHref}
          collapsed={collapsed}
          linkAs={linkAs}
        />
      ))}
    </div>
  );
}
