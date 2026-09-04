import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/base/Button";
import { Input } from "../components/base/Input";
import { Select } from "../components/base/Select";
import { Checkbox } from "../components/base/Checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/base/Table";
import { StatusBadge } from "../components/domain/StatusBadge";
import type { CaseStatus } from "../lib/status-map";

/**
 * Composição story-only (não exportada em src/index.ts, não é um componente
 * novo) para verificar visualmente se os componentes base revisados
 * funcionam bem juntos numa tela realista do domínio: abertura de case
 * (formulário) ao lado da fila de cases em andamento (tabela).
 */
const meta: Meta = {
  title: "Compositions/Case Intake",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

const statusOptions = [
  { value: "OPEN", label: "Aberto" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "WAITING_CLIENT", label: "Aguardando cliente" },
];

const queue: { id: string; cliente: string; placa: string; status: CaseStatus }[] = [
  { id: "1", cliente: "Mariana Alves", placa: "ABC1D23", status: "OPEN" },
  { id: "2", cliente: "João Pereira", placa: "XYZ9K88", status: "IN_PROGRESS" },
  { id: "3", cliente: "Carla Souza", placa: "JJH2L01", status: "WAITING_CLIENT" },
  { id: "4", cliente: "Ricardo Nunes", placa: "QWE4R56", status: "WAITING_EXTERNAL" },
  { id: "5", cliente: "Fernanda Lima", placa: "TTY7U90", status: "RESOLVED" },
];

function CaseIntakeForm() {
  const [status, setStatus] = useState("OPEN");
  const [notify, setNotify] = useState(false);

  return (
    <form
      className="flex w-[360px] shrink-0 flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-elev1"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="text-h4 text-text">Novo case</h2>
      <Input label="Cliente" placeholder="Nome completo" />
      <Input label="Placa do veículo" placeholder="ABC1D23" className="font-mono uppercase" />
      <Select
        label="Status inicial"
        options={statusOptions}
        value={status}
        onValueChange={setStatus}
      />
      <Checkbox
        label="Notificar cliente por e-mail"
        checked={notify}
        onCheckedChange={(v) => setNotify(!!v)}
      />
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Criar case</Button>
      </div>
    </form>
  );
}

function CaseQueueTable() {
  return (
    <div className="flex-1">
      <h2 className="mb-3 text-h4 text-text">Fila de cases</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.cliente}</TableCell>
              <TableCell className="font-mono uppercase">{row.placa}</TableCell>
              <TableCell>
                <StatusBadge domain="case" status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="flex min-h-screen gap-6 bg-bg-default p-6">
      <CaseIntakeForm />
      <CaseQueueTable />
    </div>
  ),
};
