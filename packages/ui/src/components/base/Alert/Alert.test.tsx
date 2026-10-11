import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders the title and the description", () => {
    render(<Alert tone="info" title="Pagamento em análise" description="Aguardando o provedor." />);
    expect(screen.getByText("Pagamento em análise")).toBeInTheDocument();
    expect(screen.getByText("Aguardando o provedor.")).toBeInTheDocument();
  });

  it("interrupts the screen reader only on error", () => {
    const { rerender } = render(<Alert tone="error" title="Falha" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Alert tone="warning" title="Atenção" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("hides the decorative icon from assistive tech", () => {
    const { container } = render(<Alert tone="success" title="Tudo certo" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
