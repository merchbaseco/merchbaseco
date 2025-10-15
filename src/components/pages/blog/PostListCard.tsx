import type { AnchorHTMLAttributes } from "react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface PostListCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title: string;
  description: string;
  datetime: string;
  displayDate: string;
  tag?: string;
  accent?: string;
}

export function PostListCard({
  accent,
  className,
  datetime,
  description,
  displayDate,
  href,
  tag,
  title,
  ...props
}: PostListCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white",
        className,
      )}
      {...props}
    >
      <Card className="flex flex-col overflow-hidden border-gray-100 bg-white !p-0 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md sm:flex-row">
        <div
          aria-hidden="true"
          className="relative w-full overflow-hidden bg-gray-100 sm:w-56 lg:w-64"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                accent ??
                "radial-gradient(120% 120% at 10% 0%, rgba(192, 228, 255, 0.9) 0%, rgba(240, 244, 248, 0.7) 35%, rgba(209, 247, 226, 0.85) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)] mix-blend-lighten" />
          <div className="relative h-48 w-full sm:h-full" />
        </div>

        <div className="flex flex-1 flex-col justify-between p-8 sm:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              {tag && (
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] tracking-[0.35em] text-gray-500">
                  {tag}
                </span>
              )}
              <time dateTime={datetime}>{displayDate}</time>
            </div>

            <h3 className="mt-4 text-2xl font-semibold leading-snug text-gray-900 transition group-hover:text-gray-700">
              {title}
            </h3>
            <p className="mt-3 text-base text-gray-600">{description}</p>
          </div>

          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition group-hover:text-emerald-700">
            Read article
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </Card>
    </a>
  );
}
