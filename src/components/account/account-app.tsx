import { APIKeys, UserButton, UserProfile, useAuth, useUser } from "@clerk/react";
import { ArrowDown01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";

import { type ClerkConfiguration, MerchbaseClerkProvider } from "@/components/auth/clerk-provider";
import { SquircleReact as Squircle } from "@/components/ui/squircle";
import {
  AccessClientError,
  type AccessProfile,
  type AccessState,
  createAccessClient,
} from "@/lib/access-client";

type AccountSection = "overview" | "profile" | "access" | "api-keys";

interface AccountAppProps extends ClerkConfiguration {
  accessOrigin?: string;
  section: AccountSection;
}

const navigation: Array<{ href: string; id: AccountSection; label: string }> = [
  { href: "/account/", id: "overview", label: "Overview" },
  { href: "/account/profile/", id: "profile", label: "Profile" },
  { href: "/account/access/", id: "access", label: "Access" },
  { href: "/account/api-keys/", id: "api-keys", label: "API keys" },
];

export function AccountApp({ accessOrigin, publishableKey, section }: AccountAppProps) {
  return (
    <MerchbaseClerkProvider publishableKey={publishableKey}>
      <ProtectedAccount accessOrigin={accessOrigin} section={section} />
    </MerchbaseClerkProvider>
  );
}

function ProtectedAccount({
  accessOrigin,
  section,
}: Pick<AccountAppProps, "accessOrigin" | "section">) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AccountLoading />;
  }

  if (!isSignedIn) {
    const redirectUrl = navigation.find((item) => item.id === section)?.href ?? "/account/";
    return <SignedOut redirectUrl={redirectUrl} />;
  }

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
        <div className="flex size-12 shrink-0 items-center justify-center">
          <UserButton />
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <AccountSectionContent accessOrigin={accessOrigin} section={section} />
      </div>
    </div>
  );
}

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

function AccountSectionContent({
  accessOrigin,
  section,
}: Pick<AccountAppProps, "accessOrigin" | "section">) {
  if (section === "profile") {
    return <ProfileSection />;
  }

  if (section === "access") {
    return <AccessSection accessOrigin={accessOrigin} />;
  }

  if (section === "api-keys") {
    return <ApiKeysSection />;
  }

  return <OverviewSection />;
}

function OverviewSection() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <section aria-labelledby="overview-title">
      <p className="font-mono text-sm font-medium tracking-wide text-blue-600">YOUR MERCHBASE</p>
      <h1
        className="mt-3 max-w-[24ch] text-balance font-display text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl"
        id="overview-title"
      >
        Everything tied together{user?.firstName ? ` for ${user.firstName}` : ""}.
      </h1>
      <p className="mt-5 max-w-[56ch] text-pretty text-base/7 text-gray-600">
        Manage the identity and credentials you use across Merchbase products.
      </p>
      {email ? (
        <p className="mt-2 max-w-[56ch] text-pretty text-base/7 text-gray-500 sm:text-sm/6">
          Signed in as {email}.
        </p>
      ) : null}

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <OverviewCard
          background="bg-[#F1EAFB]"
          description="Manage your name, connected accounts, and sign-in security."
          href="/account/profile/"
          index="01"
          label="Profile"
          textColor="text-[#40245F]"
        />
        <OverviewCard
          background="bg-[#FBE8DF]"
          description="See which MerchBase products are active for your account."
          href="/account/access/"
          index="02"
          label="Product access"
          textColor="text-[#612205]"
        />
        <OverviewCard
          background="bg-[#E5EEFF]"
          description="Create and revoke credentials for scripts, agents, and integrations."
          href="/account/api-keys/"
          index="03"
          label="API keys"
          textColor="text-[#173A78]"
        />
      </div>
    </section>
  );
}

interface OverviewCardProps {
  background: string;
  description: string;
  href: string;
  index: string;
  label: string;
  textColor: string;
}

function OverviewCard({
  background,
  description,
  href,
  index,
  label,
  textColor,
}: OverviewCardProps) {
  return (
    <Squircle
      className={`group relative min-h-64 overflow-hidden ${background} ${textColor} transition-transform duration-200 hover:-translate-y-1`}
      cornerRadius={30}
      cornerSmoothing={1}
    >
      <a
        className="flex min-h-64 flex-col justify-between p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        href={href}
      >
        <div aria-hidden="true" className="absolute -right-2 -top-7 font-mono text-8xl opacity-10">
          {index}
        </div>
        <div className="relative">
          <p className="font-mono text-sm font-medium tracking-wide">{index}</p>
          <h2 className="mt-4 text-balance font-display text-2xl font-semibold tracking-tight">
            {label}
          </h2>
          <p className="mt-3 text-pretty text-base/7 sm:text-sm/6">{description}</p>
        </div>
        <p className="relative font-mono text-sm font-medium tracking-wide">OPEN SETTINGS</p>
      </a>
    </Squircle>
  );
}

function ProfileSection() {
  return (
    <section aria-labelledby="profile-title">
      <SectionHeading
        description="Update the sign-in details and security settings Clerk protects for you."
        title="Profile and security"
        titleId="profile-title"
      />
      <div className="mt-8 overflow-x-auto">
        <UserProfile apiKeysProps={{ hide: true }} routing="hash" />
      </div>
    </section>
  );
}

function ApiKeysSection() {
  return (
    <section aria-labelledby="api-keys-title">
      <SectionHeading
        description="One key works across Merchbase products your account can access."
        title="API keys"
        titleId="api-keys-title"
      />
      <Squircle
        className="mt-6 bg-[#FFF3ED] p-5 text-[#612205]"
        cornerRadius={20}
        cornerSmoothing={1}
      >
        <p className="text-pretty text-base/7 sm:text-sm/6">
          Treat API keys like passwords. Revoked keys may continue working for up to five minutes
          while authorization caches expire.
        </p>
      </Squircle>
      <div className="mt-8">
        <APIKeys showDescription />
      </div>
    </section>
  );
}

function AccessSection({ accessOrigin }: Pick<AccountAppProps, "accessOrigin">) {
  const { getToken } = useAuth();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "ready"; profile: AccessProfile }
    | { kind: "error"; message: string }
  >({ kind: "loading" });

  const load = useCallback(async () => {
    if (!accessOrigin) {
      setState({
        kind: "error",
        message: "The Access Service is not configured for this environment.",
      });
      return;
    }

    setState({ kind: "loading" });

    try {
      const token = await getToken();
      if (!token) {
        throw new AccessClientError("unauthenticated");
      }
      const profile = await createAccessClient({ origin: accessOrigin }).me(token);
      setState({ kind: "ready", profile });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof AccessClientError
            ? error.message
            : "Merchbase Access is temporarily unavailable.",
      });
    }
  }, [accessOrigin, getToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section aria-labelledby="access-title">
      <SectionHeading
        description="Access is granted once for the suite. Individual product controls can be added later without changing your account."
        title="Product access"
        titleId="access-title"
      />

      {state.kind === "loading" ? (
        <AccessLoading />
      ) : state.kind === "error" ? (
        <Squircle className="mt-8 bg-red-50 p-6 text-red-950" cornerRadius={24} cornerSmoothing={1}>
          <p className="font-semibold">Could not check access.</p>
          <p className="mt-2 text-base/7 text-red-800 sm:text-sm/6">{state.message}</p>
          <button
            className="mt-5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => void load()}
            type="button"
          >
            Try again
          </button>
        </Squircle>
      ) : (
        <AccessDetails profile={state.profile} />
      )}
    </section>
  );
}

function AccessDetails({ profile }: { profile: AccessProfile }) {
  return (
    <div className="mt-8">
      <Squircle
        className="flex flex-wrap items-center justify-between gap-5 bg-[#FBE8DF] p-6 text-[#612205]"
        cornerRadius={24}
        cornerSmoothing={1}
      >
        <div>
          <p className="font-display text-xl font-semibold">MerchBase suite</p>
          <p className="mt-1 font-mono text-sm opacity-70">{profile.merchbaseUserId}</p>
        </div>
        <StatusBadge state={profile.access} />
      </Squircle>

      <ul className="mt-7 divide-y divide-gray-950/10 border-y border-gray-950/10">
        {serviceLabels.map(([service, label]) => (
          <li className="flex items-center justify-between gap-4 py-5" key={service}>
            <p className="min-w-0 text-base font-medium text-gray-900 sm:text-sm">{label}</p>
            <StatusBadge state={profile.services[service]} />
          </li>
        ))}
      </ul>

      {profile.access === "not_granted" ? (
        <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-pretty text-base/7 text-gray-600 sm:text-sm/6">
          Your account is ready, but access has not been granted yet. Contact Merchbase to activate
          the suite.
        </p>
      ) : null}
    </div>
  );
}

const serviceLabels = [
  ["merchbase-core", "Merchbase Core"],
  ["rankwrangler", "RankWrangler"],
  ["tmterminal", "Trademark Terminal"],
  ["bidbeacon", "BidBeacon"],
  ["etsysentry", "EtsySentry"],
] as const;

function StatusBadge({ state }: { state: AccessState }) {
  const granted = state === "granted";

  return (
    <span
      className={
        granted
          ? "shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-800"
          : "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600"
      }
    >
      {granted ? "Granted" : "Not granted"}
    </span>
  );
}

interface SectionHeadingProps {
  description: string;
  title: string;
  titleId: string;
}

function SectionHeading({ description, title, titleId }: SectionHeadingProps) {
  return (
    <div>
      <h1
        className="max-w-[35ch] text-balance font-display text-4xl font-semibold tracking-tight text-gray-950"
        id={titleId}
      >
        {title}
      </h1>
      <p className="mt-4 max-w-[56ch] text-pretty text-base/7 text-gray-600">{description}</p>
    </div>
  );
}

function SignedOut({ redirectUrl }: { redirectUrl: string }) {
  return (
    <Squircle
      className="relative overflow-hidden bg-[#DC6D3E] text-white"
      cornerRadius={32}
      cornerSmoothing={1}
    >
      <div className="grid min-h-96 items-center gap-8 p-8 sm:grid-cols-[3fr_2fr] sm:p-12">
        <div className="relative z-10">
          <p className="font-mono text-sm font-medium tracking-wide text-[#FFD0BA]">
            MERCHBASE ACCOUNT
          </p>
          <h1 className="mt-4 max-w-[20ch] text-balance font-display text-4xl font-semibold tracking-tight">
            Your tools are waiting.
          </h1>
          <p className="mt-4 max-w-[48ch] text-pretty text-base/7 text-white/85">
            Sign in once to manage your profile, product access, and credentials across MerchBase.
          </p>
          <a
            className="mt-7 inline-flex rounded-lg bg-gray-950 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
            href={`/sign-in/?redirect_url=${encodeURIComponent(redirectUrl)}`}
          >
            Sign in
          </a>
        </div>
        <img alt="" className="relative mx-auto w-64 rotate-3 sm:w-72" src="/unicorn-shirt.png" />
      </div>
    </Squircle>
  );
}

function AccountLoading() {
  return (
    <div aria-label="Loading account" className="animate-pulse">
      <div className="h-10 w-80 max-w-full rounded-xl bg-gray-100" />
      <div className="mt-16 h-12 w-96 max-w-full rounded-xl bg-gray-100" />
      <div className="mt-5 h-5 w-full max-w-2xl rounded bg-gray-50" />
      <div className="mt-10 h-64 rounded-3xl bg-gray-50" />
    </div>
  );
}

function AccessLoading() {
  return (
    <div aria-label="Loading product access" className="mt-8 animate-pulse">
      <div className="h-24 rounded-3xl bg-gray-100" />
      <div className="mt-7 h-16 rounded-xl bg-gray-50" />
      <div className="mt-3 h-16 rounded-xl bg-gray-50" />
    </div>
  );
}
