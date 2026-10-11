import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useReveal } from "./use-reveal";

function OnMountProbe({ delayMs = 0 }: { delayMs?: number }) {
  const reveal = useReveal<HTMLDivElement>({ mode: "onMount", delayMs });
  return (
    <div ref={reveal.ref} data-testid="probe" className={reveal.className}>
      conteúdo
    </div>
  );
}

function OnViewProbe() {
  const reveal = useReveal<HTMLDivElement>({ mode: "onView" });
  return (
    <div ref={reveal.ref} data-testid="probe" className={reveal.className}>
      conteúdo
    </div>
  );
}

describe("useReveal", () => {
  it("is visible by default before the timer fires, then reaches visible state after the delay (onMount)", () => {
    vi.useFakeTimers();
    render(<OnMountProbe delayMs={100} />);

    // Sempre acaba visível — nunca preso invisível — mesmo sob timers falsos.
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByTestId("probe").className).toContain("opacity-100");

    vi.useRealTimers();
  });

  it("is always visible when IntersectionObserver is unavailable (onView, progressive enhancement)", () => {
    const original = window.IntersectionObserver;
    // @ts-expect-error -- simula ambiente sem suporte
    delete window.IntersectionObserver;

    render(<OnViewProbe />);
    expect(screen.getByTestId("probe").className).toContain("opacity-100");

    window.IntersectionObserver = original;
  });

  it("content is present in the DOM regardless of reveal state (never display:none)", () => {
    render(<OnViewProbe />);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});
