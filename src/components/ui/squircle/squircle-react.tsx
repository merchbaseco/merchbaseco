import { forwardRef, useEffect, useMemo } from "react";
import type {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  Ref,
} from "react";

import { ensureSquircleElement } from "./squircle-element";

export interface SquircleReactProps extends HTMLAttributes<HTMLElement> {
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export const SquircleReact = forwardRef<HTMLElement, SquircleReactProps>(
  (
    {
      children,
      className,
      cornerRadius = 24,
      cornerSmoothing = 0.8,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    useEffect(() => {
      ensureSquircleElement();
    }, []);

    const mergedStyle = useMemo<CSSProperties>(() => {
      return {
        ...style,
        "--squircle-fallback-radius": `${cornerRadius}px`,
      } as CSSProperties;
    }, [cornerRadius, style]);

    return (
      <merch-squircle
        ref={forwardedRef as Ref<HTMLElement>}
        className={className}
        corner-radius={cornerRadius}
        corner-smoothing={cornerSmoothing}
        style={mergedStyle}
        {...props}
      >
        {children}
      </merch-squircle>
    );
  },
);

SquircleReact.displayName = "SquircleReact";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "merch-squircle": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "corner-radius"?: number | string;
        "corner-smoothing"?: number | string;
      };
    }
  }
}
