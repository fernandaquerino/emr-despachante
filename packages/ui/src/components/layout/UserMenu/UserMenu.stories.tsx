import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOut, Settings, User } from "lucide-react";
import { UserMenu } from "./UserMenu";

const meta: Meta<typeof UserMenu> = {
  title: "Layout/UserMenu",
  component: UserMenu,
  args: {
    name: "Fernanda Querino",
    items: [
      { label: "Minha conta", href: "/admin/conta", icon: User },
      { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
      { label: "Sair", icon: LogOut, destructive: true, onSelect: () => {} },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};

export const WithAvatarImage: Story = {
  args: { avatarSrc: "https://i.pravatar.cc/64" },
};
