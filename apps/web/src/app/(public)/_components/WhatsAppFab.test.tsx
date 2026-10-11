import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppFab } from "./WhatsAppFab";

describe("WhatsAppFab", () => {
  it("does not render without a configured number", () => {
    render(<WhatsAppFab />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders an accessible round brand button when configured", () => {
    render(<WhatsAppFab phoneNumber="5511999999999" />);
    const link = screen.getByRole("link", { name: "Falar com a EMR no WhatsApp" });
    // Só o ícone é visível: o nome acessível precisa vir do aria-label.
    expect(link).toHaveClass("rounded-full", "bg-brand-whatsapp");
  });

  it("never puts PII in the WhatsApp deep link", () => {
    render(<WhatsAppFab phoneNumber="5511999999999" />);
    const href = screen.getByRole("link").getAttribute("href") ?? "";
    // SECURITY_AND_LGPD.md §WhatsApp outbound: nada de placa/CPF na query.
    expect(href.startsWith("https://wa.me/5511999999999?text=")).toBe(true);
    expect(decodeURIComponent(href)).not.toMatch(/[A-Z]{3}-?\d[A-Z0-9]\d{2}/);
  });
});
