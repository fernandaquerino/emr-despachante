import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders label and icon for a vehicle status", () => {
    const { container } = render(<StatusBadge domain="vehicle" status="IRREGULAR" />);
    expect(screen.getByText("Irregular")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("spins the icon for a processing payment status", () => {
    const { container } = render(<StatusBadge domain="fine" status="CLEARANCE_PROCESSING" />);
    expect(screen.getByText("Processando baixa")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("renders each case status with a distinct label", () => {
    render(<StatusBadge domain="case" status="WAITING_EXTERNAL" />);
    expect(screen.getByText("Aguardando órgão")).toBeInTheDocument();
  });
});
