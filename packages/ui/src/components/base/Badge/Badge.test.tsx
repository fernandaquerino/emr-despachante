import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders the label", () => {
    render(<Badge tone="success">Regular</Badge>);
    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("renders an aria-hidden icon when provided", () => {
    const { container } = render(
      <Badge tone="success" icon={CheckCircle2}>
        Regular
      </Badge>,
    );
    const icon = container.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("spins the icon only when iconSpin is set", () => {
    const { container } = render(
      <Badge tone="processing" icon={CheckCircle2} iconSpin>
        Processando
      </Badge>,
    );
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
  });
});
