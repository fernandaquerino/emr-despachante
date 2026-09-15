import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LogOut, User } from "lucide-react";
import { UserMenu } from "./UserMenu";

describe("UserMenu", () => {
  it("renders an accessible trigger with the user's name", () => {
    render(<UserMenu name="Fernanda Querino" items={[]} />);
    expect(
      screen.getByRole("button", { name: "Menu do usuário Fernanda Querino" }),
    ).toBeInTheDocument();
  });

  it("opens the menu and shows every item", async () => {
    const user = userEvent.setup();
    render(
      <UserMenu
        name="Fernanda Querino"
        items={[
          { label: "Minha conta", href: "/admin/conta", icon: User },
          { label: "Sair", icon: LogOut, destructive: true },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Menu do usuário Fernanda Querino" }));

    await waitFor(() => {
      expect(screen.getByText("Minha conta")).toBeInTheDocument();
      expect(screen.getByText("Sair")).toBeInTheDocument();
    });
  });

  it("renders an item with href as a link", async () => {
    const user = userEvent.setup();
    render(
      <UserMenu name="Fernanda Querino" items={[{ label: "Minha conta", href: "/admin/conta" }]} />,
    );

    await user.click(screen.getByRole("button", { name: "Menu do usuário Fernanda Querino" }));

    const link = await screen.findByRole("link", { name: "Minha conta" });
    expect(link).toHaveAttribute("href", "/admin/conta");
  });

  it("calls onSelect for an item without href", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UserMenu name="Fernanda Querino" items={[{ label: "Sair", onSelect }]} />);

    await user.click(screen.getByRole("button", { name: "Menu do usuário Fernanda Querino" }));
    await user.click(await screen.findByText("Sair"));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
