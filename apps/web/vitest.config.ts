import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Escopo restrito a `*.test.tsx` (componentes React) — os `*.test.ts`
 * puros (env, lib) continuam no runner `node:test`/`tsx` já usado pelo
 * script `test` deste app (ver package.json). Mantém os dois padrões
 * de teste já existentes no monorepo em vez de migrar tudo de uma vez.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setup-tests.ts"],
    css: false,
    globals: true,
    include: ["src/**/*.test.tsx"],
  },
});
