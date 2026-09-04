import type { StorybookConfig } from "@storybook/react-vite";

/**
 * DS-003 — Storybook e documentação visual.
 * Framework react-vite: o pacote já usa Vite via vitest (vitest.config.ts),
 * evita adicionar uma cadeia webpack só para o Storybook.
 */
const config: StorybookConfig = {
  stories: ["../src/foundations/*.mdx", "../src/components/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
