import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

function renderTabs() {
  return render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Detalhe do caso">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="payments">Pagamentos</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Conteúdo de visão geral</TabsContent>
      <TabsContent value="payments">Conteúdo de pagamentos</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("shows only the active panel and switches with arrow keys", async () => {
    renderTabs();
    expect(screen.getByText("Conteúdo de visão geral")).toBeVisible();
    expect(screen.queryByText("Conteúdo de pagamentos")).not.toBeInTheDocument();

    screen.getByRole("tab", { name: "Visão geral" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Pagamentos" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
