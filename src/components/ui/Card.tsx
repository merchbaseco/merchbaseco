import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl squircle border border-black/5 bg-white p-6 shadow-sm transition-transform duration-200 ease-out",
        className,
      )}
      {...props}
    />
  );
}
