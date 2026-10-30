import { signInTarget } from "@/lib/sign-in-target";
import { useEffect, useState } from "react";

export const AuthenticationApp = () => {
  const [target, setTarget] = useState("/account/");
  useEffect(() => setTarget(signInTarget(window.location.search)), []);
  return (
    <section aria-labelledby="sign-in-title">
      <p className="font-mono text-sm font-medium tracking-wide text-blue-600">MERCHBASE ACCOUNT</p>
      <h1
        id="sign-in-title"
        className="mt-3 font-display text-3xl font-semibold tracking-tight text-gray-950"
      >
        Sign in to MerchBase
      </h1>
      <p className="mt-4 text-base/7 text-gray-600">
        Continue to sign in securely with Cloudflare Access. Use the code sent to your approved
        email address.
      </p>
      <a
        className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        href={target}
      >
        Continue to your account
      </a>
      <p className="mt-5 text-sm/6 text-gray-500">
        MerchBase access is by invitation. Signing in does not create or activate an account.
      </p>
    </section>
  );
};
