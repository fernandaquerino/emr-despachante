import globals from "globals";
import { baseConfig } from "@emr/config/eslint/base.mjs";

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
