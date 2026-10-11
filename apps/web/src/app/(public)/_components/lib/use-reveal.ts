"use client";

import { useLayoutEffect, useRef, useState } from "react";

export interface UseRevealOptions {
  /** "onMount": anima ao carregar (hero, sempre acima da dobra).
   *  "onView": anima quando o elemento entra no viewport (demais seções). */
  mode?: "onMount" | "onView";
  /** Atraso em ms — usado para stagger curto entre elementos do mesmo grupo. */
  delayMs?: number;
}

/**
 * Reveal de entrada (fade + slide curto) sem biblioteca de animação —
 * `transform`/`opacity` apenas (issue FE-PUB-001 §Performance).
 *
 * Contrato de progressive enhancement: o elemento é visível por padrão. Só
 * entra no estado "pending" (oculto) dentro de um `useLayoutEffect` — ou
 * seja, somente quando JS de fato rodou e (para `onView`) confirmou que o
 * elemento está fora do viewport. Sem JS, ou em qualquer falha do
 * IntersectionObserver, o conteúdo nunca fica preso invisível.
 */
export function useReveal<T extends HTMLElement>({
  mode = "onView",
  delayMs = 0,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<"visible" | "pending">("visible");

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (mode === "onMount") {
      setState("pending");
      const timer = window.setTimeout(() => setState("visible"), delayMs);
      return () => window.clearTimeout(timer);
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) {
      return;
    }

    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.setTimeout(() => setState("visible"), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda uma vez por instância; delayMs/mode não mudam em runtime
  }, []);

  return {
    ref,
    className:
      state === "pending"
        ? "opacity-0 translate-y-3"
        : "opacity-100 translate-y-0 transition-[opacity,transform] duration-slow ease-decel",
  };
}
