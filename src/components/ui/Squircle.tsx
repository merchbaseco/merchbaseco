import type { CSSProperties } from "react";

import type { SquircleProps as SquirclePrimitiveProps } from "@squircle-js/react";
import { Squircle as SquirclePrimitive } from "@squircle-js/react";

export type SquircleProps = Omit<
  SquirclePrimitiveProps,
  "cornerRadius" | "cornerSmoothing" | "style"
> & {
  cornerRadius?: number;
  cornerSmoothing?: number;
  style?: CSSProperties;
};

export function Squircle({
  cornerRadius = 24,
  cornerSmoothing = 0.8,
  style,
  ...props
}: SquircleProps) {
  const fallbackStyle: CSSProperties = {
    ...(style ?? {}),
    "--squircle-fallback-radius": `${cornerRadius}px`,
  };

  return (
    <SquirclePrimitive
      {...props}
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
      style={fallbackStyle}
    />
  );
}

export type { SquirclePrimitiveProps };
