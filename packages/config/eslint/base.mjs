import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

// Regras comuns a todos os apps/packages. Cada consumidor adiciona só o que
// for específico do seu runtime (globals de Node vs browser, JSX, etc.).
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // "zero @ts-ignore sem justificativa": exige descrição de pelo menos
      // 10 caracteres explicando por que o ignore é inevitável.
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description",
          "ts-expect-error": "allow-with-description",
          minimumDescriptionLength: 10,
        },
      ],
    },
  },
  {
    ignores: ["dist/**", ".next/**", "node_modules/**"],
  },
];

export default baseConfig;
