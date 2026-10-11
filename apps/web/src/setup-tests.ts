import "@testing-library/jest-dom/vitest";

// jsdom não implementa IntersectionObserver, usado pelas seções da landing
// pública para revelar conteúdo ao entrar no viewport (ver
// src/app/(public)/_components/lib/use-reveal.ts).
if (typeof window !== "undefined" && typeof window.IntersectionObserver === "undefined") {
  class IntersectionObserverPolyfill implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver =
    IntersectionObserverPolyfill as unknown as typeof IntersectionObserver;
}

// jsdom também não implementa ResizeObserver, exigido pelos primitivos Radix
// usados na landing (Checkbox do opt-in de alertas, Tabs da Garagem Digital).
if (typeof window !== "undefined" && typeof window.ResizeObserver === "undefined") {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
