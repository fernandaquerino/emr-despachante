import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Base/Badge",
  component: Badge,
  args: { children: "Rótulo" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="error">Error</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="processing">Processing</Badge>
      <Badge tone="neutral">Neutral</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { tone: "success", icon: CheckCircle2, children: "Confirmado" },
};
