import type { Config } from "tailwindcss";
import uiPreset from "./src/tailwind-preset";

/**
 * Usado apenas pelo Storybook (via PostCSS/Vite) para as próprias stories.
 * `apps/web/tailwind.config.ts` é quem consome o preset em produção — este
 * arquivo não é publicado nem importado por consumidores do pacote.
 */
export default {
  presets: [uiPreset],
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}", "./.storybook/**/*.{ts,tsx}"],
} satisfies Config;
