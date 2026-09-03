import type { Config } from "tailwindcss";
import uiPreset from "@emr/ui/tailwind-preset";

export default {
  presets: [uiPreset],
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
} satisfies Config;
