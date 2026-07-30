import { SignIn, SignUp } from "@clerk/react";

import { type ClerkConfiguration, MerchbaseClerkProvider } from "@/components/auth/clerk-provider";

interface AuthenticationAppProps extends ClerkConfiguration {
  mode: "sign-in" | "sign-up";
}

export function AuthenticationApp({ mode, publishableKey }: AuthenticationAppProps) {
  return (
    <MerchbaseClerkProvider publishableKey={publishableKey}>
      {mode === "sign-in" ? (
        <SignIn fallbackRedirectUrl="/account/" routing="hash" signUpUrl="/sign-up/" />
      ) : (
        <SignUp fallbackRedirectUrl="/account/" routing="hash" signInUrl="/sign-in/" />
      )}
    </MerchbaseClerkProvider>
  );
}
