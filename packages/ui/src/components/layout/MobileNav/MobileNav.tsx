import type { ElementType, ReactNode } from "react";
import { DrawerContent, DrawerRoot } from "../../base/Drawer";
import { NavGroup } from "../NavGroup";
import type { SidebarGroup } from "../Sidebar";
import { scopeActivePathToGroup } from "../nav-active";

/**
 * Navegação mobile (drawer offcanvas <1024px — DESIGN_SYSTEM.md §22).
 * Reusa `NavGroup`/`Drawer` já existentes em vez de duplicar a lista de
 * itens que o `Sidebar` renderiza no desktop.
 */
export interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logo: ReactNode;
  groups: SidebarGroup[];
  activePath?: string;
  linkAs?: ElementType;
  /** Igual ao `footer` da `Sidebar`; como função é sempre chamada com `collapsed=false` (o drawer nunca colapsa). */
  footer?: ReactNode | ((collapsed: boolean) => ReactNode);
}

export function MobileNav({
  open,
  onOpenChange,
  logo,
  groups,
  activePath,
  linkAs,
  footer,
}: MobileNavProps) {
  const allGroupsHrefs = groups.map((group) => group.items.map((item) => item.href));
  const resolvedFooter = typeof footer === "function" ? footer(false) : footer;

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange}>
      <DrawerContent title="Navegação" side="left" width="sm">
        <div className="mb-4">{logo}</div>
        <nav aria-label="Navegação principal" className="flex flex-col gap-5">
          {groups.map((group, index) => (
            <NavGroup
              key={group.title ?? index}
              title={group.title}
              items={group.items}
              activePath={scopeActivePathToGroup(allGroupsHrefs, index, activePath)}
              linkAs={linkAs}
            />
          ))}
        </nav>
        {resolvedFooter ? (
          <div className="mt-4 border-t border-border pt-4">{resolvedFooter}</div>
        ) : null}
      </DrawerContent>
    </DrawerRoot>
  );
}
