import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Base/Alert",
  component: Alert,
  args: { title: "Título curto", description: "Descrição opcional do que aconteceu." },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert tone="info" title="O status é atualizado após a confirmação do pagamento." />
      <Alert
        tone="success"
        title="Pagamento confirmado."
        description="Aguardando a baixa no órgão."
      />
      <Alert
        tone="warning"
        title="Não encontramos essa placa."
        description="Confira os caracteres."
      />
      <Alert tone="error" title="Não conseguimos consultar agora." description="Tente novamente." />
    </div>
  ),
};
