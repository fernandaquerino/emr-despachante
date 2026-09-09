import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../base/Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  args: {
    title: "Solicitações",
    breadcrumb: [{ label: "Visão geral", href: "/admin" }, { label: "Solicitações" }],
  },
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithDescriptionAndActions: Story = {
  args: {
    description: "Acompanhe e responda as solicitações abertas.",
    actions: <Button>+ Nova solicitação</Button>,
  },
};

export const WithoutBreadcrumb: Story = { args: { breadcrumb: undefined } };
