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
    // Componentes que montam @radix-ui/react-popper (Tooltip, Select,
    // DropdownMenu) sob jsdom são consistentemente lentos (13-20s
    // observados localmente) para completar o primeiro posicionamento
    // dentro de um act() — investigado e confirmado que não é um loop
    // infinito (sempre resolve, contagens de rAF/setTimeout/
    // getComputedStyle são baixas), e sim uma característica de
    // performance da combinação Radix Popper + jsdom. No runner
    // compartilhado do CI (menos CPU disponível, ~36 arquivos de teste
    // concorrentes) o mesmo teste passou de 45000ms (ver histórico do CI),
    // então ampliamos a margem para não flakar por contenção de recursos.
    testTimeout: 90000,
  },
});
