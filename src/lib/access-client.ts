export const MERCHBASE_SERVICES = [
  "merchbase-core",
  "rankwrangler",
  "tmterminal",
  "bidbeacon",
  "etsysentry",
] as const;

export type MerchbaseService = (typeof MERCHBASE_SERVICES)[number];
export type AccessState = "granted" | "not_granted";

export interface AccessProfile {
  access: AccessState;
  accessValidUntil: string | null;
  merchbaseUserId: string;
  services: Record<MerchbaseService, AccessState>;
}

type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

interface AccessClientOptions {
  fetch?: Fetch;
  origin: string;
  timeoutMs?: number;
}

export class AccessClientError extends Error {
  readonly kind: "not_found" | "unauthenticated" | "unavailable";

  constructor(kind: AccessClientError["kind"]) {
    super(
      kind === "unauthenticated"
        ? "Your Merchbase session is no longer valid."
        : kind === "not_found"
          ? "That API key could not be found."
          : "Merchbase Access is temporarily unavailable.",
    );
    this.name = "AccessClientError";
    this.kind = kind;
  }
}

export const createAccessClient = ({
  fetch: fetchImplementation = globalThis.fetch,
  origin,
  timeoutMs = 3_000,
}: AccessClientOptions) => {
  const baseUrl = normalizeOrigin(origin);

  return {
    async me(sessionToken: string): Promise<AccessProfile> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImplementation(new URL("/me", baseUrl), {
          cache: "no-store",
          headers: {
            authorization: `Bearer ${sessionToken}`,
          },
          method: "GET",
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new AccessClientError("unauthenticated");
        }

        if (!response.ok) {
          throw new AccessClientError("unavailable");
        }

        return parseAccessProfile(await response.json());
      } catch (error) {
        if (error instanceof AccessClientError) {
          throw error;
        }
        throw new AccessClientError("unavailable");
      } finally {
        clearTimeout(timeout);
      }
    },
    async retireApiKey(sessionToken: string, apiKeyId: string): Promise<void> {
      if (!/^apikey_[A-Za-z0-9_-]+$/u.test(apiKeyId)) {
        throw new AccessClientError("not_found");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImplementation(
          new URL(`/api-keys/${apiKeyId}/retire`, baseUrl),
          {
            cache: "no-store",
            headers: {
              authorization: `Bearer ${sessionToken}`,
            },
            method: "POST",
            signal: controller.signal,
          },
        );

        if (response.status === 401) {
          throw new AccessClientError("unauthenticated");
        }
        if (response.status === 404) {
          throw new AccessClientError("not_found");
        }
        if (!response.ok) {
          throw new AccessClientError("unavailable");
        }
      } catch (error) {
        if (error instanceof AccessClientError) {
          throw error;
        }
        throw new AccessClientError("unavailable");
      } finally {
        clearTimeout(timeout);
      }
    },
  };
};

const normalizeOrigin = (value: string): URL => {
  const url = new URL(value);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error("PUBLIC_ACCESS_API_ORIGIN must be an HTTP origin without a path.");
  }

  return url;
};

const parseAccessProfile = (value: unknown): AccessProfile => {
  if (
    !hasExactKeys(value, ["access", "accessValidUntil", "merchbaseUserId", "services"]) ||
    !isAccessState(value.access) ||
    !isAccessValidUntil(value.accessValidUntil) ||
    typeof value.merchbaseUserId !== "string" ||
    !value.merchbaseUserId.startsWith("mbu_")
  ) {
    throw new Error("Invalid Access profile response.");
  }

  const services = value.services;
  if (
    !hasExactKeys(services, [...MERCHBASE_SERVICES]) ||
    !MERCHBASE_SERVICES.every((service) => isAccessState(services[service]))
  ) {
    throw new Error("Invalid Access profile response.");
  }

  return value as unknown as AccessProfile;
};

const isAccessState = (value: unknown): value is AccessState =>
  value === "granted" || value === "not_granted";

const isAccessValidUntil = (value: unknown): value is string | null =>
  value === null || (typeof value === "string" && Number.isFinite(Date.parse(value)));

const hasExactKeys = <Key extends string>(
  value: unknown,
  keys: Key[],
): value is Record<Key, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.keys(value).sort().join(",") === [...keys].sort().join(",");
};
