import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileSearch } from "lucide-react";
import { Button } from "../../base/Button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Domain/EmptyState",
  component: EmptyState,
  args: {
    title: "Nenhum case encontrado",
    description: "Ajuste os filtros ou crie um novo case manualmente.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button variant="secondary">Criar case manual</Button>,
  },
};

export const CustomIcon: Story = {
  args: { icon: FileSearch, title: "Nenhum documento encontrado" },
};
