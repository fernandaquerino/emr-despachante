import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "../../domain/StatusBadge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";

const rows = [
  { plate: "ABC1D23", model: "Onix", status: "REGULAR" as const },
  { plate: "XYZ9K88", model: "Corolla", status: "ATTENTION" as const },
  { plate: "JJH2L01", model: "HB20", status: "IRREGULAR" as const },
];

const meta: Meta<typeof Table> = {
  title: "Base/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Placa</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.plate}>
            <TableCell className="font-mono uppercase">{row.plate}</TableCell>
            <TableCell>{row.model}</TableCell>
            <TableCell>
              <StatusBadge domain="vehicle" status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const SelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Placa</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={row.plate} selected={index === 0}>
            <TableCell className="font-mono uppercase">{row.plate}</TableCell>
            <TableCell>{row.model}</TableCell>
            <TableCell>
              <StatusBadge domain="vehicle" status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
