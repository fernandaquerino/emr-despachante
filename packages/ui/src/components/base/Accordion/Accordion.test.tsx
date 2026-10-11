import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const items = [
  { id: "a", question: "Pergunta A", answer: "Resposta A" },
  { id: "b", question: "Pergunta B", answer: "Resposta B" },
];

describe("Accordion", () => {
  it("starts collapsed by default", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("respects defaultOpenId", () => {
    render(<Accordion items={items} defaultOpenId="a" />);
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("toggles a row open and closed on click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: "Pergunta A" });

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("only keeps one row open at a time", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole("button", { name: "Pergunta A" }));
    await user.click(screen.getByRole("button", { name: "Pergunta B" }));

    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Pergunta B" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("associates the trigger and panel via aria-controls/aria-labelledby", () => {
    render(<Accordion items={items} defaultOpenId="a" />);
    const trigger = screen.getByRole("button", { name: "Pergunta A" });
    const panelId = trigger.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();

    const panel = document.getElementById(panelId as string);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
