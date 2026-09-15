import type { ElementType, ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../../../lib/cn";
import { NavGroup, type NavGroupItem } from "../NavGroup";
import { scopeActivePathToGroup } from "../nav-active";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Sidebar.
 * Fixa no desktop (240px expandida / 72px colapsada); a navegação mobile
 * (drawer offcanvas <1024px) é responsabilidade do `MobileNav`, que reusa
 * os mesmos `groups` — o `Sidebar` em si não conhece breakpoints.
 */
export interface SidebarGroup {
  title?: string;
  items: NavGroupItem[];
}

export interface SidebarProps {
  logo: ReactNode;
  /** Renderizado no lugar de `logo` quando `collapsed` (ex.: `Logo` variant="mark"). Cai de volta em `logo` se omitido. */
  logoCollapsed?: ReactNode;
  groups: SidebarGroup[];
  activePath?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  linkAs?: ElementType;
  /** Perfil compacto + toggle de tema (COMPONENTS.md §Sidebar). Como função, recebe `collapsed` para adaptar o layout (ex.: esconder nome/label). */
  footer?: ReactNode | ((collapsed: boolean) => ReactNode);
  density?: "default" | "dense";
  className?: string;
}

export function Sidebar({
  logo,
  logoCollapsed,
  groups,
  activePath,
  collapsed = false,
  onToggleCollapse,
  linkAs,
  footer,
  density = "default",
  className,
}: SidebarProps) {
  const allGroupsHrefs = groups.map((group) => group.items.map((item) => item.href));
  const resolvedFooter = typeof footer === "function" ? footer(collapsed) : footer;

  return (
    <aside
      className={cn(
        // O breakpoint de 1024px no preset do DS é `xl` (screens custom em
        // tailwind-preset.ts), não o `lg` padrão do Tailwind — abaixo disso
        // a navegação vira drawer via `MobileNav`. Superfície própria
        // (--surface-sidebar) distingue a sidebar do header/conteúdo sem
        // depender de uma borda pesada como único recurso.
        "hidden shrink-0 flex-col border-r border-border-subtle bg-surface-sidebar xl:flex",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar-expanded",
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center px-3.5">
        {collapsed && logoCollapsed ? logoCollapsed : logo}
      </div>

      <nav
        aria-label="Navegação principal"
        className={cn(
          "flex flex-1 flex-col overflow-y-auto",
          density === "dense" ? "gap-3 px-2 py-2" : "gap-6 px-2.5 py-3",
        )}
      >
        {groups.map((group, index) => (
          <NavGroup
            key={group.title ?? index}
            title={group.title}
            items={group.items}
            activePath={scopeActivePathToGroup(allGroupsHrefs, index, activePath)}
            collapsed={collapsed}
            linkAs={linkAs}
          />
        ))}
      </nav>

      {onToggleCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "mx-2.5 mb-1 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-body-sm text-text-muted transition-colors duration-fast ease-standard",
            "hover:bg-bg-subtle hover:text-text-secondary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            collapsed && "justify-center px-2",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span>Recolher</span>
            </>
          )}
        </button>
      ) : null}

      {resolvedFooter ? (
        <div
          className={cn(
            "flex flex-col gap-1 border-t border-border-subtle p-2",
            collapsed && "items-center",
          )}
        >
          {resolvedFooter}
        </div>
      ) : null}
    </aside>
  );
}
