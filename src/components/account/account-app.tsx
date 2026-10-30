import { AccessClientError, type AccessProfile, createAccessClient } from "@/lib/access-client";
import { ArrowDown01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";
import { AccountOverview } from "./account-overview";
import { AccountAccess, AccountProfile } from "./account-profile";
import { AccountMessage } from "./account-ui";
import { ApiKeysSection } from "./api-keys-section";

type AccountSection = "overview" | "profile" | "access" | "api-keys";
const navigation: Array<{ href: string; id: AccountSection; label: string }> = [
  { href: "/account/", id: "overview", label: "Overview" },
  { href: "/account/profile/", id: "profile", label: "Profile" },
  { href: "/account/access/", id: "access", label: "Access" },
  { href: "/account/api-keys/", id: "api-keys", label: "API keys" },
];
type AccountState =
  | { kind: "loading" }
  | { kind: "ready"; profile: AccessProfile }
  | { kind: "error"; error: AccessClientError };
export const AccountApp = ({ section }: { section: AccountSection }) => {
  const [state, setState] = useState<AccountState>({ kind: "loading" });
  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      setState({ kind: "ready", profile: await createAccessClient().me() });
    } catch (error) {
      setState({
        kind: "error",
        error: error instanceof AccessClientError ? error : new AccessClientError("unavailable"),
      });
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  if (state.kind === "loading")
    return (
      <div aria-label="Loading account" className="animate-pulse">
        <div className="h-10 w-80 max-w-full rounded-xl bg-gray-100" />
        <div className="mt-16 h-64 rounded-3xl bg-gray-50" />
      </div>
    );
  if (state.kind === "error")
    return <AccountMessage error={state.error} onRetry={() => void load()} />;
  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <nav aria-label="Account" className="-mx-2 hidden min-w-0 overflow-x-auto px-2 sm:block">
          <ul className="flex min-w-max gap-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  aria-current={section === item.id ? "page" : undefined}
                  className={
                    section === item.id
                      ? "rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-950"
                      : "rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNavigation section={section} />
        <a
          className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-600"
          href="/cdn-cgi/access/logout"
        >
          Sign out
        </a>
      </div>
      <div className="mt-12 sm:mt-16">
        {section === "profile" ? (
          <AccountProfile profile={state.profile} />
        ) : section === "access" ? (
          <AccountAccess profile={state.profile} />
        ) : section === "api-keys" ? (
          <ApiKeysSection canCreate={state.profile.access === "granted"} />
        ) : (
          <AccountOverview />
        )}
      </div>
    </div>
  );
};

function MobileNavigation({ section }: { section: AccountSection }) {
  const current = navigation.find((item) => item.id === section) ?? navigation[0];

  return (
    <details className="group relative sm:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-xl bg-gray-100 px-3 text-base font-medium text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        <span>{current.label}</span>
        <HugeiconsIcon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          color="currentColor"
          icon={ArrowDown01Icon}
          size={16}
        />
      </summary>
      <nav
        aria-label="Account pages"
        className="absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10"
      >
        <ul className="grid gap-1">
          {navigation.map((item) => (
            <li key={item.id}>
              <a
                aria-current={section === item.id ? "page" : undefined}
                className={
                  section === item.id
                    ? "flex min-h-11 items-center rounded-xl bg-gray-100 px-3 text-base font-medium text-gray-950"
                    : "flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }
                href={item.href}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
