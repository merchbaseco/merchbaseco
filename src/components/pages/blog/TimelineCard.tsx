import type { HTMLAttributes } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface TimelineCardProps extends HTMLAttributes<HTMLElement> {
  anchor: string;
  datetime: string;
  href: string;
  tag: string;
  title: string;
  description: string;
  displayDate: string;
}

export function TimelineCard({
  anchor,
  className,
  datetime,
  displayDate,
  href,
  tag,
  title,
  description,
  ...props
}: TimelineCardProps) {
  return (
    <article id={anchor} className={cn("scroll-mt-32", className)} {...props}>
      <Card className="group overflow-hidden border-gray-100 px-0 pb-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
              {tag}
            </span>
          </div>
        </div>

        <div className="px-8">
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            <time dateTime={datetime}>{displayDate}</time>
            <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:inline-block" />
            <span className="text-emerald-500">MerchBase</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-gray-900 transition group-hover:text-gray-700">
            {title}
          </h2>
          <p className="mt-4 text-base text-gray-600">{description}</p>

          <a
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition group-hover:text-emerald-700"
            href={href}
          >
            Read the update
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </Card>
    </article>
  );
}
