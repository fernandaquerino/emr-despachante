import type { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Feedback → Tooltip.
 * Delay 350ms hover, 0ms keyboard focus (padrão Radix), max-width 240px.
 */
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: RadixTooltip.TooltipContentProps["side"];
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={350}>{children}</RadixTooltip.Provider>;
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-tooltip max-w-[240px] rounded-sm bg-surface-inverse px-2.5 py-1.5 text-body-sm text-text-inverse shadow-elev2",
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-surface-inverse" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
