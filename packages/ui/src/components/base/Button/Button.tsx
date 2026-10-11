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
/**
 * Exportado para estilizar um `<a>`/`Link` externo como botão (ex.: CTA de
 * navegação) sem aninhar `<button>` dentro de `<a>` — HTML inválido e
 * inacessível. Ver COMPONENTS.md §Guidelines de composição.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm font-medium " +
    "transition-[color,background-color,border-color,transform] duration-fast ease-standard " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 " +
    // Feedback tátil: o botão afunda 1px no clique. Só transform — nada de
    // top/left — para não sair da composite layer.
    "active:translate-y-px disabled:active:translate-y-0 " +
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
        /**
         * CTA de conversão — **exclusivo da área pública** (`app/(public)`).
         * Proibido em tela autenticada e proibido no mesmo bloco visível de um
         * `StatusBadge` âmbar: âmbar já significa warning/aguardando no app, e
         * este variant abre exceção consciente ao "acento único" da landing.
         * Contexto completo e restrições: ADR-016.
         */
        cta:
          "bg-action-cta text-text-on-cta font-semibold hover:bg-action-cta-hover " +
          "active:bg-action-cta-active disabled:bg-action-primary-disabled disabled:text-text-disabled",
        destructive:
          "bg-action-destructive text-text-on-primary hover:bg-action-destructive-hover active:bg-action-destructive-active",
        ghost: "bg-transparent text-text hover:bg-bg-subtle",
        link: "bg-transparent p-0 h-auto text-text-link underline hover:no-underline",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body",
        lg: "h-12 px-5 text-body",
        /** Só para CTA de dobra na área pública — alvo de toque generoso. */
        xl: "h-14 px-8 text-lead",
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
        {loading ? (
          <Loader2 aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
