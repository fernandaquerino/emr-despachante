import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and responds to click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Assumir caso</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Assumir caso" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the label visible and sets aria-busy while loading", () => {
    render(<Button loading>Salvando</Button>);
    const button = screen.getByRole("button", { name: /salvando/i });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("is disabled and not clickable when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Indisponível
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Indisponível" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
