import globals from "globals";
import { baseConfig } from "@emr/config/eslint/base.mjs";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    // Build estático do Storybook (`pnpm build-storybook`) — gerado, não é
    // código-fonte. `dist/**` do baseConfig não cobre esse diretório.
    ignores: ["storybook-static/**"],
  },
];
