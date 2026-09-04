import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerContent, DrawerRoot, DrawerTrigger } from "./Drawer";
import { Button } from "../Button";

describe("Drawer", () => {
  it("opens with an accessible title and closes on Escape", async () => {
    render(
      <DrawerRoot>
        <DrawerTrigger asChild>
          <Button>Ver detalhes</Button>
        </DrawerTrigger>
        <DrawerContent title="Detalhes do veículo">ABC1D23</DrawerContent>
      </DrawerRoot>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Ver detalhes" }));
    expect(await screen.findByRole("dialog")).toHaveAccessibleName("Detalhes do veículo");

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
