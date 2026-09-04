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
    // Componentes que montam @radix-ui/react-popper (Tooltip, Select) sob
    // jsdom são consistentemente lentos (8-20s observados localmente) para
    // completar o primeiro posicionamento dentro de um act() — investigado
    // e confirmado que não é um loop infinito (sempre resolve, contagens de
    // rAF/setTimeout/getComputedStyle são baixas), e sim uma característica
    // de performance da combinação Radix Popper + jsdom. O default de 5s do
    // vitest não é suficiente; usamos uma margem generosa para não flakar
    // em runners mais lentos/compartilhados.
    testTimeout: 45000,
  },
});
