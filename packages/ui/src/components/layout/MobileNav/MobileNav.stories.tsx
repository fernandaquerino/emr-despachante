import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, LayoutDashboard } from "lucide-react";
import { Button } from "../../base/Button";
import { Logo } from "../Logo";
import { MobileNav } from "./MobileNav";

const meta: Meta<typeof MobileNav> = {
  title: "Layout/MobileNav",
  component: MobileNav,
  args: {
    logo: <Logo variant="full" size="sm" />,
    activePath: "/admin",
    groups: [
      {
        title: "Operação",
        items: [
          { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
          { label: "Solicitações", href: "/admin/solicitacoes", icon: FileText },
        ],
      },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof MobileNav>;

export const Default: Story = {
  render: (args) => {
    function Wrapper() {
      const [open, setOpen] = useState(true);
      return <MobileNav {...args} open={open} onOpenChange={setOpen} />;
    }
    return <Wrapper />;
  },
};

export const Closed: Story = {
  render: (args) => {
    function Wrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Abrir menu</Button>
          <MobileNav {...args} open={open} onOpenChange={setOpen} />
        </>
      );
    }
    return <Wrapper />;
  },
};
