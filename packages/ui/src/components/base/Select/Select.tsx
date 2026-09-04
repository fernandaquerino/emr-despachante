import { useId } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Forms → Select/Combobox.
 * Para listas fechadas curtas. Listas ≥10 opções ou entidades usam
 * `Combobox` (fora do escopo desta issue).
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  label,
  hideLabel,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
}: SelectProps) {
  const triggerId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={triggerId}
        className={cn("text-label font-medium text-text", hideLabel && "sr-only")}
      >
        {label}
      </label>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={triggerId}
          className={cn(
            "flex h-10 items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 text-body text-text",
            "focus-visible:outline-none focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/20",
            "disabled:bg-bg-subtle disabled:text-text-disabled",
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-dropdown overflow-hidden rounded-md border border-border bg-surface-raised shadow-elev2"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex h-9 cursor-pointer items-center gap-2 rounded-sm px-3 text-body text-text",
                    "data-[highlighted]:bg-surface-selected data-[highlighted]:outline-none",
                  )}
                >
                  <RadixSelect.ItemIndicator>
                    <Check aria-hidden="true" className="h-3.5 w-3.5 text-action-accent" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
