import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Layout/Logo",
  component: Logo,
  args: {
    tone: "brand",
  },
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const FullSmall: Story = { args: { variant: "full", size: "sm" } };
export const FullMedium: Story = { args: { variant: "full", size: "md" } };
export const FullLarge: Story = { args: { variant: "full", size: "lg" } };

export const MarkSmall: Story = { args: { variant: "mark", size: "sm" } };
export const MarkMedium: Story = { args: { variant: "mark", size: "md" } };
export const MarkLarge: Story = { args: { variant: "mark", size: "lg" } };

export const OnDarkSurface: Story = {
  args: {
    variant: "full",
    tone: "inverse",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="rounded-md bg-surface-inverse p-6">
        <Story />
      </div>
    ),
  ],
};
