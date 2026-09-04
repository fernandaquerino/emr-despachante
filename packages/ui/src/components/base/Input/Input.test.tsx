import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("associates the label with the field", () => {
    render(<Input label="Nome do cliente" defaultValue="Mariana Alves" />);
    expect(screen.getByLabelText("Nome do cliente")).toHaveValue("Mariana Alves");
  });

  it("marks the field invalid and links the error message", () => {
    render(<Input label="Placa do veículo" error="Placa incompleta — informe 7 caracteres" />);
    const input = screen.getByLabelText("Placa do veículo");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Placa incompleta — informe 7 caracteres")).toBeInTheDocument();
    expect(input.getAttribute("aria-describedby")).toContain(
      screen.getByText("Placa incompleta — informe 7 caracteres").id,
    );
  });

  it("hides the visual label but keeps it accessible when hideLabel is set", () => {
    render(<Input label="Buscar" hideLabel placeholder="Buscar cliente, placa, caso…" />);
    const label = screen.getByText("Buscar");
    expect(label).toHaveClass("sr-only");
    expect(screen.getByLabelText("Buscar")).toBeInTheDocument();
  });
});
