import { forwardRef, useId } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Forms → Checkbox/Radio/Switch.
 * `Check` para marcado, `Minus` para indeterminate. Nunca renderizado sem
 * label (UX_RULES.md §4 Cognitiva).
 */
export interface CheckboxProps
  extends
    Omit<RadixCheckbox.CheckboxProps, "checked">,
    Required<Pick<RadixCheckbox.CheckboxProps, "checked">> {
  label: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label htmlFor={checkboxId} className="inline-flex items-center gap-2 text-body text-text">
        <RadixCheckbox.Root
          ref={ref}
          id={checkboxId}
          className={cn(
            "flex h-[18px] w-[18px] items-center justify-center rounded-xs border border-border-strong",
            "transition-colors duration-fast ease-standard",
            "data-[state=unchecked]:hover:border-action-accent",
            "data-[state=checked]:border-action-accent data-[state=checked]:bg-action-accent",
            "data-[state=indeterminate]:border-action-accent data-[state=indeterminate]:bg-action-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-strong",
            className,
          )}
          {...props}
        >
          <RadixCheckbox.Indicator className="text-text-on-accent">
            {props.checked === "indeterminate" ? (
              <Minus aria-hidden="true" className="h-3 w-3" />
            ) : (
              <Check aria-hidden="true" className="h-3 w-3" />
            )}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        {label}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
