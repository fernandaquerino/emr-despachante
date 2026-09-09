import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Menu, Sparkles } from "lucide-react";
import { Breadcrumb } from "../Breadcrumb";
import { HeaderIconButton } from "../HeaderIconButton";
import { SearchPlaceholder } from "../SearchPlaceholder";
import { UserMenu } from "../UserMenu";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  args: {
    left: (
      <Breadcrumb items={[{ label: "Visão geral", href: "/admin" }, { label: "Solicitações" }]} />
    ),
    userMenu: <UserMenu name="Fernanda Querino" items={[{ label: "Sair", onSelect: () => {} }]} />,
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithSearchAndActions: Story = {
  args: {
    searchSlot: <SearchPlaceholder placeholder="Buscar (Ctrl+K)" />,
    actionsSlot: (
      <>
        <HeaderIconButton icon={Sparkles} label="Copilot" />
        <HeaderIconButton icon={Bell} label="Notificações" badge />
      </>
    ),
    mobileNavTrigger: <HeaderIconButton icon={Menu} label="Abrir menu" />,
  },
};

export const Tall: Story = { args: { height: "tall" } };
