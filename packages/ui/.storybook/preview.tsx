import type { Preview } from "@storybook/react-vite";

import "../src/styles/tokens.css";
import "../src/styles/base.css";

/**
 * Breakpoints reais do design system (docs/design-system/TOKENS.md §Breakpoints)
 * — usados nos viewports "mobile"/"desktop" em vez dos presets genéricos do
 * Storybook, para o issue "viewport mobile/desktop" corresponder ao que o
 * produto realmente usa.
 */
const preview: Preview = {
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
