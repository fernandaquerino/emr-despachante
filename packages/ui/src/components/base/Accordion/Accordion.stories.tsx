import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Base/Accordion",
  component: Accordion,
  args: {
    items: [
      {
        id: "1",
        question: "Preciso ter cadastro para consultar meu veículo?",
        answer: "Não. A consulta inicial pela placa não exige cadastro.",
      },
      {
        id: "2",
        question: "O EMR resolve multas de qualquer estado?",
        answer:
          "A cobertura varia por serviço e estado. Consulte a disponibilidade ao iniciar a solicitação.",
      },
      {
        id: "3",
        question: "Como acompanho o andamento de uma solicitação?",
        answer: "Pelo seu painel, com atualizações de status a cada etapa do processo.",
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const WithDefaultOpen: Story = {
  args: { defaultOpenId: "1" },
};
