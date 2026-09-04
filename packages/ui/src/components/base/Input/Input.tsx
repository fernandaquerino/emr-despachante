import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia/estados: docs/design-system/COMPONENTS.md §Forms → Input.
 * Label sempre visível (UX_RULES.md §5) — por isso `label` é obrigatório;
 * use `hideLabel` só quando o contexto visual já deixa claro o propósito
 * (ex.: filtro inline) e ainda assim precisar de rótulo acessível.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hideLabel, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={cn("text-label font-medium text-text", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(
            "h-10 rounded-sm border border-border bg-surface px-3 text-body text-text",
            "placeholder:text-text-disabled",
            "focus-visible:outline-none focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/20",
            "disabled:bg-bg-subtle disabled:text-text-disabled",
            error && "border-status-error",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <span id={hintId} className="text-caption text-text-muted">
            {hint}
          </span>
        ) : null}
        {error ? (
          <span id={errorId} className="text-caption text-status-error-fg">
            {error}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
