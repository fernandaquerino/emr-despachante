import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/cn";

/**
 * Anatomia/estados: docs/design-system/COMPONENTS.md §Actions → Button.
 * Máximo 1 `primary` por bloco visível é responsabilidade de quem consome —
 * o componente não impõe isso.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-sm font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-100",
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-text-on-primary hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-primary-disabled disabled:text-text-disabled",
        secondary:
          "bg-surface text-text border border-action-secondary-border hover:bg-action-secondary-hover disabled:text-text-disabled",
        accent:
          "bg-surface text-action-accent border border-action-accent hover:bg-action-secondary-hover",
        destructive:
          "bg-action-destructive text-text-on-primary hover:bg-action-destructive-hover active:bg-action-destructive-active",
        ghost: "bg-transparent text-text hover:bg-bg-subtle",
        link: "bg-transparent p-0 h-auto text-text-link underline hover:no-underline",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body",
        lg: "h-12 px-5 text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Spinner à esquerda + `aria-busy`. Nunca esconde o label. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size: variant === "link" ? undefined : size }),
          className,
        )}
        disabled={disabled ?? loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
