import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MoneyBreakdown } from "./MoneyBreakdown";

describe("MoneyBreakdown", () => {
  it("formats each line and the total in PT-BR currency", () => {
    render(
      <MoneyBreakdown
        lines={[
          { label: "Multa", amountCents: 28490 },
          { label: "Taxa de serviço", amountCents: 1200 },
        ]}
        totalCents={29690}
      />,
    );

    expect(screen.getByText("R$ 284,90")).toBeInTheDocument();
    expect(screen.getByText("R$ 12,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 296,90")).toBeInTheDocument();
  });

  it("uses a custom total label when provided", () => {
    render(<MoneyBreakdown lines={[]} totalLabel="Valor a pagar" totalCents={0} />);
    expect(screen.getByText("Valor a pagar")).toBeInTheDocument();
  });
});
