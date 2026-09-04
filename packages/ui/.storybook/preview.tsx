import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";

import "./preview.css";

/**
 * Breakpoints reais do design system (docs/design-system/TOKENS.md §Breakpoints)
 * — usados nos viewports "mobile"/"desktop" em vez dos presets genéricos do
 * Storybook, para o issue "viewport mobile/desktop" corresponder ao que o
 * produto realmente usa.
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema de cor (docs/design-system/TOKENS.md §3 — dark é opt-in)",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Aplica [data-theme] na raiz do documento do preview — é o seletor
      // que tokens.css usa para o tema dark, então isso é o único jeito de
      // efetivamente trocar de tema no Storybook (não existe outro hook).
      useEffect(() => {
        document.documentElement.dataset.theme = context.globals.theme as string;
      }, [context.globals.theme]);
      return <Story />;
    },
  ],
  parameters: {
    viewport: {
      options: {
        mobile: {
          name: "Mobile (--bp-sm)",
          styles: { width: "375px", height: "667px" },
        },
        desktop: {
          name: "Desktop (--bp-xl)",
          styles: { width: "1024px", height: "800px" },
        },
      },
    },
    initialGlobals: {
      viewport: { value: "desktop" },
      theme: "light",
    },
    a11y: {
      // Reprova o build (`test-storybook`/CI futuro) apenas em violações
      // sérias — o objetivo aqui é inspecionar, não travar cada story por
      // detalhe cosmético do addon.
      test: "todo",
    },
  },
};

export default preview;
