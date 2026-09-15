import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function renderMenu(onSelectSair = vi.fn()) {
  return render(
    <DropdownMenuRoot>
      <DropdownMenuTrigger>Abrir menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={User}>Minha conta</DropdownMenuItem>
        <DropdownMenuItem icon={LogOut} destructive onSelect={onSelectSair}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>,
  );
}

describe("DropdownMenu", () => {
  it("opens the menu and shows items when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(screen.queryByText("Minha conta")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    await waitFor(() => expect(screen.getByText("Minha conta")).toBeInTheDocument());
  });

  it("calls onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelectSair = vi.fn();
    renderMenu(onSelectSair);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await waitFor(() => screen.getByText("Sair"));
    await user.click(screen.getByText("Sair"));

    expect(onSelectSair).toHaveBeenCalledTimes(1);
  });

  it("closes the menu on Escape", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await waitFor(() => screen.getByText("Minha conta"));

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Minha conta")).not.toBeInTheDocument());
  });

  it("applies destructive styling to the destructive item", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const item = await screen.findByText("Sair");
    expect(item.closest('[role="menuitem"]')).toHaveClass("text-status-error-fg");
  });
});
