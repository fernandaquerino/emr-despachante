import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

/**
 * `window.localStorage` não é confiável entre ambientes de teste (varia
 * por versão de Node/jsdom) — mockamos explicitamente em vez de depender
 * da implementação do jsdom, o que também deixa o teste determinístico.
 */
function createStorageMock() {
  let store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    clear: () => {
      store = new Map();
    },
  };
}

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("ThemeToggle", () => {
  const storage = createStorageMock();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
    document.documentElement.removeAttribute("data-theme");
    mockMatchMedia(false);
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to the system theme when nothing is stored (light)", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Mudar para tema escuro" })).toBeInTheDocument();
  });

  it("defaults to dark when the system prefers dark and nothing is stored", () => {
    mockMatchMedia(true);
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Mudar para tema claro" })).toBeInTheDocument();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("respects a previously stored preference over the system theme", () => {
    storage.setItem("emr-theme", "dark");
    mockMatchMedia(false);
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Mudar para tema claro" })).toBeInTheDocument();
  });

  it("toggles the theme, updates the DOM attribute and persists the choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Mudar para tema escuro" }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(storage.getItem("emr-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Mudar para tema claro" })).toBeInTheDocument();
  });

  it("hides the text label when collapsed but keeps the accessible name", () => {
    render(<ThemeToggle collapsed />);
    expect(screen.queryByText("Tema escuro")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mudar para tema escuro" })).toBeInTheDocument();
  });
});
