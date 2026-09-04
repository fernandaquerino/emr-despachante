import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoneyBreakdown } from "./MoneyBreakdown";

const meta: Meta<typeof MoneyBreakdown> = {
  title: "Domain/MoneyBreakdown",
  component: MoneyBreakdown,
  args: {
    lines: [
      { label: "Taxa do serviço", amountCents: 8900 },
      { label: "Multas em aberto", amountCents: 24350 },
      { label: "Taxa do DETRAN", amountCents: 5200 },
    ],
    totalCents: 38450,
  },
};

export default meta;
type Story = StoryObj<typeof MoneyBreakdown>;

export const Default: Story = {};

export const CustomTotalLabel: Story = {
  args: { totalLabel: "Total a pagar" },
};

export const SingleLine: Story = {
  args: {
    lines: [{ label: "Taxa do serviço", amountCents: 8900 }],
    totalCents: 8900,
  },
};
