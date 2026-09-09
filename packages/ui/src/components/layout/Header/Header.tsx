import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Header.
 * 56px sticky (ADMIN/PARTNER) ou 64px (OWNER, sem sidebar — DESIGN_SYSTEM.md
 * §14). Agnóstico do conteúdo dos slots — não sabe o que são `searchSlot`/
 * `actionsSlot` (evita hardcode de Copilot/busca/notificações aqui).
 */
export interface HeaderProps {
  height?: "default" | "tall";
  left: ReactNode;
  searchSlot?: ReactNode;
  actionsSlot?: ReactNode;
  userMenu: ReactNode;
  mobileNavTrigger?: ReactNode;
  className?: string;
}

export function Header({
  height = "default",
  left,
  searchSlot,
  actionsSlot,
  userMenu,
  mobileNavTrigger,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-header flex shrink-0 items-center gap-4 border-b border-border bg-surface-default px-4",
        height === "tall" ? "h-16" : "h-header",
        className,
      )}
    >
      {mobileNavTrigger ? <div className="xl:hidden">{mobileNavTrigger}</div> : null}

      <div className="flex min-w-0 flex-1 items-center gap-4">{left}</div>

      {searchSlot ? <div className="hidden flex-1 justify-center md:flex">{searchSlot}</div> : null}

      <div className="flex shrink-0 items-center gap-1">
        {actionsSlot}
        {userMenu}
      </div>
    </header>
  );
}
