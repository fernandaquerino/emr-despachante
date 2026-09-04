import "@testing-library/jest-dom/vitest";

// jsdom não implementa estas APIs de ponteiro/scroll/observers usadas pelos
// primitivos Radix (Select, Tooltip, Dialog). Sem isso, interações via
// @testing-library/user-event travam (Radix espera `PointerEvent` real) ou
// lançam "not implemented" em jsdom.
if (typeof window !== "undefined") {
  if (typeof window.PointerEvent === "undefined") {
    class PointerEventPolyfill extends MouseEvent implements PointerEvent {
      pointerId: number;
      pointerType: string;
      isPrimary: boolean;
      width: number;
      height: number;
      pressure: number;
      tangentialPressure: number;
      tiltX: number;
      tiltY: number;
      twist: number;
      altitudeAngle: number;
      azimuthAngle: number;

      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 0;
        this.pointerType = params.pointerType ?? "mouse";
        this.isPrimary = params.isPrimary ?? true;
        this.width = params.width ?? 1;
        this.height = params.height ?? 1;
        this.pressure = params.pressure ?? 0;
        this.tangentialPressure = params.tangentialPressure ?? 0;
        this.tiltX = params.tiltX ?? 0;
        this.tiltY = params.tiltY ?? 0;
        this.twist = params.twist ?? 0;
        this.altitudeAngle = params.altitudeAngle ?? 0;
        this.azimuthAngle = params.azimuthAngle ?? 0;
      }

      getCoalescedEvents = () => [];
      getPredictedEvents = () => [];
    }
    window.PointerEvent = PointerEventPolyfill;
  }
  if (!window.HTMLElement.prototype.hasPointerCapture) {
    window.HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (!window.HTMLElement.prototype.setPointerCapture) {
    window.HTMLElement.prototype.setPointerCapture = () => {};
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = () => {};
  }
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = () => {};
  }
  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
