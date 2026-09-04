import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { DialogRoot, DialogTrigger, DialogContent } from "./Dialog";

const meta: Meta<typeof DialogContent> = {
  title: "Base/Dialog",
  component: DialogContent,
  parameters: {
    // Overlay/portal — não faz sentido no snapshot de a11y estático da grid.
    a11y: { test: "off" },
  },
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

export const Default: Story = {
  render: (args) => (
    <DialogRoot defaultOpen>
      <DialogTrigger asChild>
        <Button variant="secondary">Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent
        {...args}
        title="Confirmar cancelamento"
        footer={
          <>
            <Button variant="ghost">Voltar</Button>
            <Button variant="destructive">Cancelar case</Button>
          </>
        }
      >
        <p className="text-body text-text-secondary">
          Esta ação não pode ser desfeita. O cliente será notificado do cancelamento.
        </p>
      </DialogContent>
    </DialogRoot>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <DialogRoot key={size}>
          <DialogTrigger asChild>
            <Button variant="secondary">{`Tamanho ${size}`}</Button>
          </DialogTrigger>
          <DialogContent title={`Diálogo ${size}`} size={size}>
            <p className="text-body text-text-secondary">Conteúdo de exemplo.</p>
          </DialogContent>
        </DialogRoot>
      ))}
    </div>
  ),
};
