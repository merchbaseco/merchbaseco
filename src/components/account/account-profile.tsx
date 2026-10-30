import type { AccessProfile } from "@/lib/access-client";
import { SectionHeading, StatusBadge } from "./account-ui";

export const AccountProfile = ({ profile }: { profile: AccessProfile }) => (
  <section aria-labelledby="profile-title">
    <SectionHeading
      id="profile-title"
      title="Profile and security"
      description="One Merchbase identity connects your products. Cloudflare Access protects your sign-in."
    />
    <dl className="mt-8 divide-y divide-gray-950/10 border-y border-gray-950/10">
      <div className="py-5">
        <dt className="font-medium text-gray-950">Merchbase identity</dt>
        <dd className="mt-2 break-all font-mono text-sm text-gray-600">
          {profile.merchbaseUserId}
        </dd>
      </div>
      <div className="py-5">
        <dt className="font-medium text-gray-950">Sign-in security</dt>
        <dd className="mt-2 max-w-[56ch] text-base/7 text-gray-600">
          Sign in with your approved Google account. Google manages sign-in security; Merchbase
          manages product access and API keys.
        </dd>
      </div>
    </dl>
    <p className="mt-6 max-w-[56ch] text-base/7 text-gray-600">
      To change the email you use for Merchbase, contact Merchbase so your existing product data
      stays attached to this identity.
    </p>
  </section>
);
const labels: Record<string, string> = {
  "merchbase-core": "Merchbase Core",
  rankwrangler: "RankWrangler",
  tmterminal: "Trademark Terminal",
  bidbeacon: "BidBeacon",
  etsysentry: "EtsySentry",
  atlas: "Atlas",
  handmade: "Handmade",
  fulfillment: "Merchbase Fulfillment",
  factory: "Factory",
};
export const AccountAccess = ({ profile }: { profile: AccessProfile }) => (
  <section aria-labelledby="access-title">
    <SectionHeading
      id="access-title"
      title="Product access"
      description="Your Merchbase access applies across the suite. API-key expiry is managed separately."
    />
    <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#FBE8DF] p-6 text-[#612205]">
      <div>
        <p className="font-display text-xl font-semibold">MerchBase suite</p>
        <p className="mt-1 break-all font-mono text-sm opacity-70">{profile.merchbaseUserId}</p>
        <p className="mt-2 text-sm">
          {profile.accessValidUntil
            ? `Access ends ${new Date(profile.accessValidUntil).toLocaleString()}`
            : "No access end date"}
        </p>
      </div>
      <StatusBadge state={profile.access} />
    </div>
    <ul className="mt-7 divide-y divide-gray-950/10 border-y border-gray-950/10">
      {Object.entries(profile.services).map(([service, state]) => (
        <li className="flex items-center justify-between gap-4 py-5" key={service}>
          <p className="min-w-0 text-base font-medium text-gray-900 sm:text-sm">
            {labels[service] ?? service}
          </p>
          <StatusBadge state={state} />
        </li>
      ))}
    </ul>
    {profile.access === "not_granted" ? (
      <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-base/7 text-gray-600">
        Access is not currently granted. Your product data and existing credentials are preserved.
        Contact Merchbase to review access.
      </p>
    ) : null}
  </section>
);
