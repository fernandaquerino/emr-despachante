import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Bell } from "lucide-react";
import { HeaderIconButton } from "./HeaderIconButton";

describe("HeaderIconButton", () => {
  it("renders with an accessible label", () => {
    render(<HeaderIconButton icon={Bell} label="Notificações" />);
    expect(screen.getByRole("button", { name: "Notificações" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<HeaderIconButton icon={Bell} label="Notificações" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "Notificações" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render a badge dot by default", () => {
    const { container } = render(<HeaderIconButton icon={Bell} label="Notificações" />);
    expect(container.querySelector('[aria-hidden="true"].bg-status-error')).not.toBeInTheDocument();
  });

  it("renders a badge dot when badge is true", () => {
    const { container } = render(<HeaderIconButton icon={Bell} label="Notificações" badge />);
    expect(container.querySelector('[aria-hidden="true"].bg-status-error')).toBeInTheDocument();
  });
});
