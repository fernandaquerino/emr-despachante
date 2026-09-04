import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Base/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="fines">Multas</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 text-body-sm text-text-secondary">
        Conteúdo da aba "Visão geral".
      </TabsContent>
      <TabsContent value="fines" className="pt-4 text-body-sm text-text-secondary">
        Conteúdo da aba "Multas".
      </TabsContent>
      <TabsContent value="documents" className="pt-4 text-body-sm text-text-secondary">
        Conteúdo da aba "Documentos".
      </TabsContent>
    </Tabs>
  ),
};
