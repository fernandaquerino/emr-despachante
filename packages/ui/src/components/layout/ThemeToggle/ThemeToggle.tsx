"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../../../lib/cn";

/**
 * Toggle de tema no rodapé da Sidebar (docs/design-system/COMPONENTS.md
 * §Navigation → Sidebar: "Bottom: perfil compacto + toggle de tema").
 * O tema é ativado via `[data-theme="dark"|"light"]` na raiz do documento
 * (tokens.css §Dark mode / tailwind.config `darkMode`). Sem escolha salva,
 * o CSS já resolve por `prefers-color-scheme` — este componente só entra
 * em ação quando a pessoa escolhe explicitamente um tema, persistindo a
 * escolha em `localStorage` para as próximas visitas.
 */
const STORAGE_KEY = "emr-theme";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  // `localStorage` pode estar indisponível (modo privado, quota estourada,
  // ou o navegador simplesmente não expõe a API) — degradar para o tema do
  // sistema em vez de quebrar a renderização.
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage?.setItem(STORAGE_KEY, theme);
  } catch {
    // Tema ainda é aplicado ao DOM nesta sessão — só a persistência falha.
  }
}

export interface ThemeToggleProps {
  className?: string;
  collapsed?: boolean;
}

export function ThemeToggle({ className, collapsed = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? getSystemTheme());

  // Sincroniza, uma única vez, o estado inicial (lido de localStorage ou do
  // sistema) com o DOM — troca subsequentes são feitas direto em `toggle`.
  // Deliberadamente `[]`: só espelha o valor computado na inicialização do
  // `useState`, não deve re-rodar quando `theme` muda por `toggle`.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  const label = theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-body-sm text-text-secondary",
        "hover:bg-bg-subtle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        collapsed && "justify-center px-2",
        className,
      )}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="h-5 w-5 shrink-0" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5 shrink-0" />
      )}
      {!collapsed ? <span>{theme === "dark" ? "Tema claro" : "Tema escuro"}</span> : null}
    </button>
  );
}
