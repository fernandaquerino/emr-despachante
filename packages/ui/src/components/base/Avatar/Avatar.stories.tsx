import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Base/Avatar",
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: { name: "Fernanda Querino" },
};

export const WithImage: Story = {
  args: { name: "Fernanda Querino", src: "https://i.pravatar.cc/80" },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar name="Mariana Alves" size="sm" />
      <Avatar name="Mariana Alves" size="md" />
      <Avatar name="Mariana Alves" size="lg" />
    </div>
  ),
};
