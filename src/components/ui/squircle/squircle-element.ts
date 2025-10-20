import { getSvgPath } from "figma-squircle";

const DEFAULT_RADIUS = 24;
const DEFAULT_SMOOTHING = 0.8;

const ATTRIBUTE_CORNER_RADIUS = "corner-radius";
const ATTRIBUTE_CORNER_SMOOTHING = "corner-smoothing";

const parseNumberAttribute = (value: string | null, fallback: number) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const registerSquircleElement = () => {
  if (
    typeof window === "undefined" ||
    typeof window.HTMLElement === "undefined" ||
    typeof customElements === "undefined"
  ) {
    return;
  }

  if (customElements.get("merch-squircle")) {
    return;
  }

  class MerchSquircleElement extends HTMLElement {
    static get observedAttributes() {
      return [ATTRIBUTE_CORNER_RADIUS, ATTRIBUTE_CORNER_SMOOTHING];
    }

    private resizeObserver?: ResizeObserver;
    private frameId?: number;
    private cornerRadius = DEFAULT_RADIUS;
    private cornerSmoothing = DEFAULT_SMOOTHING;

    connectedCallback() {
      this.setAttribute("data-squircle", "");
      this.updateGeometryFromAttributes();
      this.applyClipPath();
      this.scheduleUpdate();

      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => {
          this.scheduleUpdate();
        });
        this.resizeObserver.observe(this);
      }
    }

    disconnectedCallback() {
      this.resizeObserver?.disconnect();
      if (this.frameId !== undefined) {
        cancelAnimationFrame(this.frameId);
        this.frameId = undefined;
      }
    }

    attributeChangedCallback() {
      this.updateGeometryFromAttributes();
      this.scheduleUpdate();
    }

    private updateGeometryFromAttributes() {
      this.cornerRadius = parseNumberAttribute(
        this.getAttribute(ATTRIBUTE_CORNER_RADIUS),
        DEFAULT_RADIUS,
      );
      this.cornerSmoothing = parseNumberAttribute(
        this.getAttribute(ATTRIBUTE_CORNER_SMOOTHING),
        DEFAULT_SMOOTHING,
      );

      this.style.setProperty("--squircle-fallback-radius", `${this.cornerRadius}px`);
      if (!this.style.borderRadius) {
        this.style.borderRadius = `${this.cornerRadius}px`;
      }
    }

    private scheduleUpdate() {
      if (this.frameId !== undefined) {
        return;
      }

      this.frameId = requestAnimationFrame(() => {
        this.frameId = undefined;
        this.applyClipPath();
      });
    }

    private applyClipPath() {
      const { width, height } = this.getBoundingClientRect();

      if (width <= 0 || height <= 0) {
        this.style.removeProperty("clip-path");
        return;
      }

      const path = getSvgPath({
        width,
        height,
        cornerRadius: this.cornerRadius,
        cornerSmoothing: this.cornerSmoothing,
      });

      this.style.clipPath = `path('${path}')`;
    }
  }

  customElements.define("merch-squircle", MerchSquircleElement);
};

export const ensureSquircleElement = () => {
  registerSquircleElement();
};

registerSquircleElement();

declare global {
  interface HTMLElementTagNameMap {
    "merch-squircle": HTMLElement;
  }
}
