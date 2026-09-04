import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Overlay → Drawer.
 * Construído sobre @radix-ui/react-dialog (mesmo focus trap/`Esc`/aria do
 * Dialog) com slide lateral — não há primitivo Radix dedicado a drawer e
 * isso evita depender de mais uma lib para um caso já coberto.
 */
export const DrawerRoot = RadixDialog.Root;
export const DrawerTrigger = RadixDialog.Trigger;

const widthClasses = {
  sm: "w-[360px]",
  md: "w-[480px]",
  lg: "w-[640px]",
} as const;

export interface DrawerContentProps extends RadixDialog.DialogContentProps {
  title: string;
  width?: keyof typeof widthClasses;
  side?: "left" | "right";
}

export function DrawerContent({
  title,
  width = "md",
  side = "right",
  children,
  className,
  ...props
}: DrawerContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-drawer bg-[rgba(15,23,42,0.5)]" />
      <RadixDialog.Content
        className={cn(
          "fixed inset-y-0 z-drawer flex max-w-full flex-col bg-surface-raised shadow-elev3",
          "focus-visible:outline-none",
          side === "right" ? "right-0 rounded-l-xl" : "left-0 rounded-r-xl",
          widthClasses[width],
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <RadixDialog.Title className="text-h4 text-text">{title}</RadixDialog.Title>
          <RadixDialog.Close
            aria-label="Fechar"
            className="text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </RadixDialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
