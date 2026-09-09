import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchPlaceholder } from "./SearchPlaceholder";

const meta: Meta<typeof SearchPlaceholder> = {
  title: "Layout/SearchPlaceholder",
  component: SearchPlaceholder,
};
export default meta;

type Story = StoryObj<typeof SearchPlaceholder>;

export const Default: Story = {};
export const CustomPlaceholder: Story = { args: { placeholder: "Buscar (Ctrl+K)" } };
