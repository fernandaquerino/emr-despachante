import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarFooter } from "./SidebarFooter";

const meta: Meta<typeof SidebarFooter> = {
  title: "Layout/SidebarFooter",
  component: SidebarFooter,
  args: { name: "Fernanda Querino" },
};
export default meta;

type Story = StoryObj<typeof SidebarFooter>;

export const Default: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
