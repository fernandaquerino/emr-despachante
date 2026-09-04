import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

describe("Table", () => {
  it("renders header scope and row content", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Caso</TableHead>
            <TableHead>Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>#1842</TableCell>
            <TableCell>Mariana Alves</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("columnheader", { name: "Caso" })).toHaveAttribute("scope", "col");
    expect(screen.getByText("#1842")).toBeInTheDocument();
    expect(screen.getByText("Mariana Alves").closest("tr")).toHaveClass("bg-surface-selected");
  });
});
