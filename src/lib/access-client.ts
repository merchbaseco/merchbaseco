export type AccessState = "granted" | "not_granted";
export interface AccessProfile {
  access: AccessState;
  accessValidUntil: string | null;
  merchbaseUserId: string;
  services: Record<string, AccessState>;
}
export interface ApiKeyMetadata {
  clientId: string;
  createdAt: number;
  expiresAt: number | null;
  name: string;
  providerId: string;
  retiredAt: number | null;
}
export interface CreatedApiKey {
  apiKey: string;
  metadata: Pick<ApiKeyMetadata, "clientId" | "expiresAt" | "name" | "providerId">;
}
type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
type ErrorKind = "not_found" | "unauthenticated" | "denied" | "unavailable";

export class AccessClientError extends Error {
  readonly kind: ErrorKind;
  constructor(kind: ErrorKind) {
    super(
      {
        unauthenticated: "Your Merchbase session has expired. Sign in again.",
        denied: "This sign-in is not enabled for this action. Contact Merchbase for access.",
        not_found: "That API key could not be found. Refresh the list and try again.",
        unavailable: "Merchbase Access is temporarily unavailable. Try again shortly.",
      }[kind],
    );
    this.name = "AccessClientError";
    this.kind = kind;
  }
}

export const createAccessClient = ({
  fetch: send = globalThis.fetch,
  timeoutMs = 10_000,
}: { fetch?: Fetch; timeoutMs?: number } = {}) => {
  const request = async <Result>(
    path: string,
    parse: (response: Response) => Promise<Result>,
    body?: object,
  ): Promise<Result> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await send(`/account/api${path}`, {
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        method: body ? "POST" : "GET",
        redirect: "error",
        signal: controller.signal,
      });
      if (response.status === 401) throw new AccessClientError("unauthenticated");
      if (response.status === 403) throw new AccessClientError("denied");
      if (response.status === 404)
        throw new AccessClientError(path.startsWith("/api-keys/") ? "not_found" : "unavailable");
      if (!response.ok) throw new AccessClientError("unavailable");
      return await parse(response);
    } catch (error) {
      throw error instanceof AccessClientError ? error : new AccessClientError("unavailable");
    } finally {
      clearTimeout(timeout);
    }
  };
  const json = async (response: Response): Promise<unknown> => {
    try {
      if (!response.headers.get("content-type")?.startsWith("application/json"))
        throw new Error("Invalid response.");
      return await response.json();
    } catch {
      throw new AccessClientError("unavailable");
    }
  };
  return {
    me: (): Promise<AccessProfile> =>
      request("/me", async (response) => parseProfile(await json(response))),
    listApiKeys: (): Promise<ApiKeyMetadata[]> =>
      request("/api-keys", async (response) => {
        const value = record(await json(response));
        if (!Array.isArray(value.apiKeys)) throw new AccessClientError("unavailable");
        return value.apiKeys.map(parseApiKey);
      }),
    createApiKey: (input: { name: string; expiresAt: number | null }): Promise<CreatedApiKey> =>
      request(
        "/api-keys",
        async (response) => {
          const value = record(await json(response));
          if (
            typeof value.apiKey !== "string" ||
            value.apiKey.length > 2048 ||
            !/^mbk_v1\.[A-Za-z0-9_-]+$/u.test(value.apiKey)
          )
            throw new AccessClientError("unavailable");
          return { apiKey: value.apiKey, metadata: parseKeyReference(value.metadata) };
        },
        input,
      ),
    retireApiKey: async (providerId: string): Promise<void> => {
      if (!/^[A-Za-z0-9_-]{1,128}$/u.test(providerId)) throw new AccessClientError("not_found");
      return await request(
        `/api-keys/${providerId}/retire`,
        async (response) => {
          if (response.status !== 204) throw new AccessClientError("unavailable");
        },
        {},
      );
    },
  };
};

const parseProfile = (input: unknown): AccessProfile => {
  const value = record(input);
  if (
    !isAccessState(value.access) ||
    !(
      value.accessValidUntil === null ||
      (typeof value.accessValidUntil === "string" &&
        Number.isFinite(Date.parse(value.accessValidUntil)))
    ) ||
    typeof value.merchbaseUserId !== "string" ||
    !/^mbu_[A-Za-z0-9_-]{1,120}$/u.test(value.merchbaseUserId)
  )
    throw new AccessClientError("unavailable");
  const services: Record<string, AccessState> = {};
  for (const [service, state] of Object.entries(record(value.services))) {
    if (!/^[a-z][a-z0-9-]{0,63}$/u.test(service) || !isAccessState(state))
      throw new AccessClientError("unavailable");
    services[service] = state;
  }
  if (Object.keys(services).length === 0) throw new AccessClientError("unavailable");
  return {
    access: value.access,
    accessValidUntil: value.accessValidUntil,
    merchbaseUserId: value.merchbaseUserId,
    services,
  };
};
const parseKeyReference = (input: unknown): CreatedApiKey["metadata"] => {
  const value = record(input);
  if (
    typeof value.clientId !== "string" ||
    !value.clientId ||
    typeof value.providerId !== "string" ||
    !/^[A-Za-z0-9_-]{1,128}$/u.test(value.providerId) ||
    typeof value.name !== "string" ||
    !value.name ||
    !isNullableTime(value.expiresAt)
  )
    throw new AccessClientError("unavailable");
  return {
    clientId: value.clientId,
    providerId: value.providerId,
    name: value.name,
    expiresAt: value.expiresAt,
  };
};
const parseApiKey = (input: unknown): ApiKeyMetadata => {
  const value = record(input);
  const reference = parseKeyReference(value);
  if (!isTime(value.createdAt) || !isNullableTime(value.retiredAt))
    throw new AccessClientError("unavailable");
  return { ...reference, createdAt: value.createdAt, retiredAt: value.retiredAt };
};
const record = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new AccessClientError("unavailable");
  return Object.fromEntries(Object.entries(value));
};
const isTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const isNullableTime = (value: unknown): value is number | null => value === null || isTime(value);
const isAccessState = (value: unknown): value is AccessState =>
  value === "granted" || value === "not_granted";
