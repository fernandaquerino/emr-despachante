import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Timeline } from "./Timeline";

describe("Timeline", () => {
  it("renders events as a feed of articles", () => {
    render(
      <Timeline
        events={[
          { id: "1", title: "Caso criado", at: new Date(), description: "Prioridade Alta." },
          {
            id: "2",
            title: "Nota interna",
            at: new Date(),
            description: "Aguardando retorno.",
            highlighted: true,
          },
        ]}
      />,
    );

    expect(screen.getByRole("feed")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Caso criado")).toBeInTheDocument();
  });

  it("shows a loading skeleton instead of the feed while loading", () => {
    render(<Timeline events={[]} loading />);
    expect(screen.queryByRole("feed")).not.toBeInTheDocument();
  });

  it("shows an empty state with a custom message when there are no events", () => {
    render(<Timeline events={[]} emptyMessage="Este caso ainda não tem eventos registrados." />);
    expect(screen.getByText("Este caso ainda não tem eventos registrados.")).toBeInTheDocument();
  });
});
