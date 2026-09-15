import type { LucideIcon } from "lucide-react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Dropdown menu.
 * Construído sobre @radix-ui/react-dropdown-menu, no mesmo padrão de
 * wrapping do Select/Dialog: Root/Trigger reexportados diretamente,
 * Content/Item estilizados com os tokens do DS.
 */
export const DropdownMenuRoot = RadixDropdownMenu.Root;
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;

export interface DropdownMenuContentProps extends RadixDropdownMenu.DropdownMenuContentProps {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function DropdownMenuContent({
  align = "end",
  sideOffset = 4,
  className,
  ...props
}: DropdownMenuContentProps) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-dropdown min-w-[200px] overflow-hidden rounded-md border border-border bg-surface-raised p-1 shadow-elev2",
          className,
        )}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  );
}

export interface DropdownMenuItemProps extends RadixDropdownMenu.DropdownMenuItemProps {
  icon?: LucideIcon;
  destructive?: boolean;
}

export function DropdownMenuItem({
  icon: Icon,
  destructive = false,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <RadixDropdownMenu.Item
      className={cn(
        "flex h-9 cursor-pointer items-center gap-2 rounded-sm px-3 text-body text-text",
        "data-[highlighted]:bg-surface-selected data-[highlighted]:outline-none",
        destructive && "text-status-error-fg data-[highlighted]:bg-status-error-bg",
        className,
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /> : null}
      {children}
    </RadixDropdownMenu.Item>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: RadixDropdownMenu.DropdownMenuSeparatorProps) {
  return (
    <RadixDropdownMenu.Separator className={cn("my-1 h-px bg-border", className)} {...props} />
  );
}
