import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DialogContent, DialogRoot, DialogTrigger } from "./Dialog";
import { Button } from "../Button";

describe("Dialog", () => {
  it("opens on trigger click, exposes an accessible title and closes on close button", async () => {
    const onOpenChange = vi.fn();
    render(
      <DialogRoot onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Cancelar caso</Button>
        </DialogTrigger>
        <DialogContent title="Cancelar caso?">Esta ação não pode ser desfeita.</DialogContent>
      </DialogRoot>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancelar caso" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Cancelar caso?");

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
