import type { HTMLAttributes } from "react";

import { Squircle } from "@/components/ui/Squircle";

import { cn } from "@/lib/utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <Squircle
      cornerRadius={24}
      cornerSmoothing={0.8}
      className={cn(
        "rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-transform duration-200 ease-out",
        className,
      )}
      {...props}
    />
  );
}
