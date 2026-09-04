import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles via keyboard and reports the new state", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Selecionado" checked={false} onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Selecionado" });
    checkbox.focus();
    await userEvent.keyboard("[Space]");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("shows the indeterminate indicator", () => {
    render(<Checkbox label="Parcial" checked="indeterminate" onCheckedChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
  });
});
