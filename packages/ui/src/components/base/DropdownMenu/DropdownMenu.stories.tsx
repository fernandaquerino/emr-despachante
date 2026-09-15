import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "../Button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const meta: Meta<typeof DropdownMenuContent> = {
  title: "Base/DropdownMenu",
};
export default meta;

type Story = StoryObj<typeof DropdownMenuContent>;

export const Default: Story = {
  render: () => (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Abrir menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={User}>Minha conta</DropdownMenuItem>
        <DropdownMenuItem icon={Settings}>Configurações</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={LogOut} destructive>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  ),
};
