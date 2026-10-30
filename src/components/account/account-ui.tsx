import type { AccessClientError, AccessState } from "@/lib/access-client";

export const SectionHeading = ({
  title,
  description,
  id,
}: { title: string; description: string; id: string }) => (
  <div>
    <h1
      className="max-w-[35ch] text-balance font-display text-4xl font-semibold tracking-tight text-gray-950"
      id={id}
    >
      {title}
    </h1>
    <p className="mt-4 max-w-[56ch] text-pretty text-base/7 text-gray-600">{description}</p>
  </div>
);
export const StatusBadge = ({ state }: { state: AccessState }) => (
  <span
    className={
      state === "granted"
        ? "shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-800"
        : "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600"
    }
  >
    {state === "granted" ? "Granted" : "Not granted"}
  </span>
);
export const AccountMessage = ({
  error,
  onRetry,
}: { error: AccessClientError; onRetry: () => void }) => (
  <section
    className="rounded-3xl bg-[#FFF3ED] p-7 text-[#612205]"
    aria-labelledby="account-error-title"
  >
    <h1 id="account-error-title" className="font-display text-2xl font-semibold">
      {error.kind === "unauthenticated"
        ? "Sign in to continue"
        : error.kind === "denied"
          ? "Access needs attention"
          : "Could not load your account"}
    </h1>
    <p className="mt-3 max-w-[56ch] text-base/7" role="alert">
      {error.message}
    </p>
    {error.kind === "unauthenticated" ? (
      <a
        href="/account/"
        className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gray-950 px-4 text-sm font-medium text-white"
      >
        Sign in again
      </a>
    ) : error.kind === "denied" ? (
      <a
        href="/cdn-cgi/access/logout"
        className="mt-5 inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-medium underline"
      >
        Sign out
      </a>
    ) : (
      <button
        type="button"
        className="mt-5 min-h-11 rounded-xl bg-gray-950 px-4 text-sm font-medium text-white"
        onClick={onRetry}
      >
        Try again
      </button>
    )}
  </section>
);
