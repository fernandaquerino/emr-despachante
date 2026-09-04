import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../../lib/cn";

/**
 * Anatomia: docs/design-system/COMPONENTS.md §Navigation → Tabs.
 * Underline style, padding 12/16, gap 24, border-bottom 2px no ativo.
 */
export const Tabs = RadixTabs.Root;

export function TabsList({ className, ...props }: RadixTabs.TabsListProps) {
  return (
    <RadixTabs.List className={cn("flex gap-6 border-b border-border", className)} {...props} />
  );
}

export function TabsTrigger({ className, ...props }: RadixTabs.TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "border-b-2 border-transparent px-0 py-3 text-body font-medium text-text-secondary",
        "data-[state=active]:border-action-accent data-[state=active]:text-text",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent(props: RadixTabs.TabsContentProps) {
  return <RadixTabs.Content {...props} />;
}
