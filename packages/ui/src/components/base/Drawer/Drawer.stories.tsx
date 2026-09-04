import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { DrawerRoot, DrawerTrigger, DrawerContent } from "./Drawer";

const meta: Meta<typeof DrawerContent> = {
  title: "Base/Drawer",
  component: DrawerContent,
  parameters: {
    a11y: { test: "off" },
  },
};

export default meta;
type Story = StoryObj<typeof DrawerContent>;

export const Default: Story = {
  render: (args) => (
    <DrawerRoot defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="secondary">Abrir painel</Button>
      </DrawerTrigger>
      <DrawerContent {...args} title="Detalhes do case">
        <p className="text-body text-text-secondary">Conteúdo do painel lateral.</p>
      </DrawerContent>
    </DrawerRoot>
  ),
};

export const LeftSide: Story = {
  args: { side: "left" },
  render: (args) => (
    <DrawerRoot defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="secondary">Abrir à esquerda</Button>
      </DrawerTrigger>
      <DrawerContent {...args} title="Filtros">
        <p className="text-body text-text-secondary">Conteúdo do painel lateral.</p>
      </DrawerContent>
    </DrawerRoot>
  ),
};

export const Widths: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((width) => (
        <DrawerRoot key={width}>
          <DrawerTrigger asChild>
            <Button variant="secondary">{`Largura ${width}`}</Button>
          </DrawerTrigger>
          <DrawerContent title={`Painel ${width}`} width={width}>
            <p className="text-body text-text-secondary">Conteúdo de exemplo.</p>
          </DrawerContent>
        </DrawerRoot>
      ))}
    </div>
  ),
};
