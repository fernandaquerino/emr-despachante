import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipProvider } from "./Tooltip";
import { Button } from "../Button";

describe("Tooltip", () => {
  it("shows the tooltip content when the trigger receives keyboard focus", async () => {
    render(
      <TooltipProvider>
        <Tooltip content="Ver detalhes completos">
          <Button>Ação</Button>
        </Tooltip>
      </TooltipProvider>,
    );

    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Ver detalhes completos");
  });
});
