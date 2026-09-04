import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setup-tests.ts"],
    css: false,
    // @testing-library/react só registra o cleanup automático entre testes
    // quando encontra `afterEach` global — necessário mesmo importando
    // describe/it/expect explicitamente nos arquivos de teste.
    globals: true,
  },
});
