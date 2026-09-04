import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./Timeline";

const now = Date.now();
const events = [
  { id: "3", title: "Documento gerado", at: new Date(now - 5 * 60 * 1000) },
  {
    id: "2",
    title: "Nota interna adicionada",
    description: "Cliente confirmou o pagamento por telefone.",
    at: new Date(now - 3 * 60 * 60 * 1000),
    highlighted: true,
  },
  { id: "1", title: "Case aberto", at: new Date(now - 26 * 60 * 60 * 1000) },
];

const meta: Meta<typeof Timeline> = {
  title: "Domain/Timeline",
  component: Timeline,
  args: { events },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, events: [] },
};

export const Empty: Story = {
  args: { events: [], emptyMessage: "Ainda não há eventos registrados." },
};
