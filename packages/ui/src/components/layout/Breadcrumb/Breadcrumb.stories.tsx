import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Layout/Breadcrumb",
  component: Breadcrumb,
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/admin" },
      { label: "Clientes", href: "/admin/clientes" },
      { label: "Fernanda Querino" },
    ],
  },
};

export const Truncated: Story = {
  args: {
    items: [
      { label: "Home", href: "/admin" },
      { label: "Um nome de cliente extremamente longo para caber na tela" },
    ],
  },
};
