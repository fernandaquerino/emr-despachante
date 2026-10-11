import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PartnerLeadForm } from "./PartnerLeadForm";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PartnerLeadForm", () => {
  it("shows an error per empty required field instead of submitting", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();
    render(<PartnerLeadForm phoneNumber="5511988887777" />);

    await user.click(screen.getByRole("button", { name: /empresa parceira/i }));

    expect(screen.getByText("Informe o nome da empresa.")).toBeInTheDocument();
    expect(screen.getByText("Informe quem podemos procurar.")).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("builds a WhatsApp deep link carrying the filled fields", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();
    render(<PartnerLeadForm phoneNumber="5511988887777" />);

    await user.type(screen.getByLabelText("Nome da empresa"), "Veloce Seminovos");
    await user.type(screen.getByLabelText("Responsável"), "Marcela Tavares");
    await user.type(screen.getByLabelText("WhatsApp ou e-mail"), "marcela@veloce.com.br");
    await user.click(screen.getByRole("button", { name: /empresa parceira/i }));

    expect(open).toHaveBeenCalledTimes(1);
    const url = decodeURIComponent(String(open.mock.calls[0]?.[0]));
    expect(url).toContain("https://wa.me/5511988887777");
    expect(url).toContain("Veloce Seminovos");
    expect(url).toContain("marcela@veloce.com.br");
  });

  it("falls back to the commercial contact link when no number is configured", () => {
    render(<PartnerLeadForm />);
    expect(screen.queryByRole("button", { name: /empresa parceira/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Falar com o comercial" })).toBeInTheDocument();
  });

  it("never claims the request was sent", async () => {
    vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();
    render(<PartnerLeadForm phoneNumber="5511988887777" />);

    await user.type(screen.getByLabelText("Nome da empresa"), "Veloce Seminovos");
    await user.type(screen.getByLabelText("Responsável"), "Marcela Tavares");
    await user.type(screen.getByLabelText("WhatsApp ou e-mail"), "marcela@veloce.com.br");
    await user.click(screen.getByRole("button", { name: /empresa parceira/i }));

    // Abrir o WhatsApp não é ter enviado nada.
    expect(
      screen.queryByText(/solicitação enviada|cadastro realizado|obrigado pelo contato/i),
    ).not.toBeInTheDocument();
  });
});
