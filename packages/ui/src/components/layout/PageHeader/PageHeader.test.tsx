import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Solicitações" />);
    expect(screen.getByRole("heading", { name: "Solicitações" })).toBeInTheDocument();
  });

  it("renders the breadcrumb when provided", () => {
    render(
      <PageHeader
        title="Solicitações"
        breadcrumb={[{ label: "Visão geral", href: "/admin" }, { label: "Solicitações" }]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("omits the breadcrumb when not provided", () => {
    render(<PageHeader title="Solicitações" />);
    expect(screen.queryByRole("navigation", { name: "Breadcrumb" })).not.toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Solicitações" description="Descrição da tela" />);
    expect(screen.getByText("Descrição da tela")).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(<PageHeader title="Solicitações" actions={<button>Nova solicitação</button>} />);
    expect(screen.getByRole("button", { name: "Nova solicitação" })).toBeInTheDocument();
  });
});
