import { ClerkProvider } from "@clerk/react";
import { isPublishableKey } from "@clerk/shared/keys";
import type { PropsWithChildren } from "react";

export interface ClerkConfiguration {
  publishableKey?: string;
}

export function MerchbaseClerkProvider({
  children,
  publishableKey,
}: PropsWithChildren<ClerkConfiguration>) {
  if (typeof publishableKey !== "string" || !isPublishableKey(publishableKey)) {
    return <ConfigurationError />;
  }

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        elements: {
          card: "w-full bg-transparent p-0 shadow-none ring-0",
          cardBox: "w-full shadow-none",
          footer: "bg-transparent",
          footerActionLink: "font-medium text-blue-600 hover:text-blue-700",
          formButtonPrimary:
            "bg-blue-600 font-medium shadow-none hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          headerSubtitle: "text-gray-600",
          headerTitle: "font-display text-2xl font-semibold tracking-tight text-gray-950",
          rootBox: "w-full",
          socialButtonsBlockButton: "font-medium shadow-none ring-1 ring-black/10 hover:bg-gray-50",
          userButtonAvatarBox: "ring-1 ring-black/10",
        },
        variables: {
          borderRadius: "0.875rem",
          colorBackground: "#ffffff",
          colorPrimary: "#2563eb",
          fontFamily:
            '"Public Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      }}
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/account/"
      signInUrl="/sign-in/"
      signUpFallbackRedirectUrl="/account/"
      signUpUrl="/sign-up/"
    >
      {children}
    </ClerkProvider>
  );
}

function ConfigurationError() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-[#FFF3ED] p-6 text-[#612205]">
      <p className="font-semibold">Account Center is not configured.</p>
      <p className="mt-2 text-base/7 sm:text-sm/6">
        Add the Clerk publishable key for this environment, then reload the page.
      </p>
    </div>
  );
}
