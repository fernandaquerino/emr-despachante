import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders a specific message and role=alert", () => {
    render(
      <ErrorState
        context="os casos"
        description="A conexão com o servidor falhou."
        onRetry={() => {}}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Não conseguimos carregar os casos");
    expect(screen.getByText("A conexão com o servidor falhou.")).toBeInTheDocument();
  });

  it("calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(<ErrorState context="os casos" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
