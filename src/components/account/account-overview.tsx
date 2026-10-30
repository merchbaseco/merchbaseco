import { SquircleReact as Squircle } from "@/components/ui/squircle/squircle-react";

export const AccountOverview = () => (
  <section aria-labelledby="overview-title">
    <p className="font-mono text-sm font-medium tracking-wide text-blue-600">YOUR MERCHBASE</p>
    <h1
      className="mt-3 max-w-[24ch] text-balance font-display text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl"
      id="overview-title"
    >
      Everything tied together.
    </h1>
    <p className="mt-5 max-w-[56ch] text-pretty text-base/7 text-gray-600">
      Manage your access and the credentials you use across Merchbase products.
    </p>
    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      <OverviewCard
        background="bg-[#F1EAFB]"
        description="Review your Merchbase identity and how you sign in."
        href="/account/profile/"
        index="01"
        label="Profile"
        textColor="text-[#40245F]"
      />
      <OverviewCard
        background="bg-[#FBE8DF]"
        description="See which MerchBase products your account can access."
        href="/account/access/"
        index="02"
        label="Product access"
        textColor="text-[#612205]"
      />
      <OverviewCard
        background="bg-[#E5EEFF]"
        description="Create and retire credentials for scripts and integrations."
        href="/account/api-keys/"
        index="03"
        label="API keys"
        textColor="text-[#173A78]"
      />
    </div>
  </section>
);

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
