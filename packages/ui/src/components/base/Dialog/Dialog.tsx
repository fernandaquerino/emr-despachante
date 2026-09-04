import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia/regras: docs/design-system/COMPONENTS.md §Overlay → Modal.
 * Base para `ConfirmDialog` — quem consome decide `Esc` habilitado ou não
 * (Radix já suporta `onEscapeKeyDown` para bloquear em fluxos destrutivos).
 */
export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

const sizeClasses = {
  sm: "max-w-[520px]",
  md: "max-w-[720px]",
  lg: "max-w-[960px]",
} as const;

export interface DialogContentProps extends RadixDialog.DialogContentProps {
  title: string;
  size?: keyof typeof sizeClasses;
  footer?: ReactNode;
}

export function DialogContent({
  title,
  size = "sm",
  footer,
  children,
  className,
  ...props
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-modal bg-[rgba(15,23,42,0.5)]" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-modal w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-raised shadow-elev3",
          "focus-visible:outline-none",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <RadixDialog.Title className="text-h3 text-text">{title}</RadixDialog.Title>
          <RadixDialog.Close
            aria-label="Fechar"
            className="text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <X aria-hidden="true" strokeWidth={1.5} className="h-4 w-4" />
          </RadixDialog.Close>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-border p-4">{footer}</div>
        ) : null}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
