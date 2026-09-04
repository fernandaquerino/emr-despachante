import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip, TooltipProvider } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Base/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Reenvia a notificação para o cliente por e-mail.",
    children: <Button variant="secondary">Reenviar</Button>,
  },
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-6 p-8">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip ${side}`} side={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
