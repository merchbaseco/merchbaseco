import { describe, expect, test } from "bun:test";

import { AccessClientError, createAccessClient } from "@/lib/access-client";

const grantedProfile = {
  access: "granted",
  accessValidUntil: null,
  merchbaseUserId: "mbu_test",
  services: {
    bidbeacon: "granted",
    etsysentry: "granted",
    "merchbase-core": "granted",
    rankwrangler: "granted",
    tmterminal: "granted",
  },
} as const;

describe("Access client", () => {
  test("sends the Clerk session token only in the authorization header", async () => {
    let request: Request | undefined;
    let requestInit: RequestInit | undefined;
    const fetch = async (input: string | URL | Request, init?: RequestInit) => {
      request = new Request(input, init);
      requestInit = init;
      return Response.json(grantedProfile);
    };

    const profile = await createAccessClient({
      fetch,
      origin: "https://access.merchbase.co",
    }).me("session-token");

    expect(profile).toEqual(grantedProfile);
    expect(request?.url).toBe("https://access.merchbase.co/me");
    expect(requestInit?.cache).toBe("no-store");
    expect(request?.headers.get("authorization")).toBe("Bearer session-token");
    expect(request?.headers.get("content-type")).toBeNull();
  });

  test("rejects an unexpected response shape", async () => {
    const client = createAccessClient({
      fetch: async () => Response.json({ access: "granted" }),
      origin: "https://access.merchbase.co",
    });

    expect(client.me("session-token")).rejects.toEqual(new AccessClientError("unavailable"));
  });

  test("distinguishes an expired session", async () => {
    const client = createAccessClient({
      fetch: async () => new Response(null, { status: 401 }),
      origin: "https://access.merchbase.co",
    });

    expect(client.me("session-token")).rejects.toMatchObject({
      kind: "unauthenticated",
    });
  });

  test("requires a pathless HTTP origin", () => {
    expect(() => createAccessClient({ origin: "https://access.merchbase.co/private" })).toThrow(
      "must be an HTTP origin without a path",
    );
  });

  test("retires an API key through the authenticated Access Service route", async () => {
    let request: Request | undefined;
    const client = createAccessClient({
      fetch: async (input, init) => {
        request = new Request(input, init);
        return new Response(null, { status: 204 });
      },
      origin: "https://access.merchbase.co",
    });

    await client.retireApiKey("session-token", "apikey_one");

    expect(request?.url).toBe("https://access.merchbase.co/api-keys/apikey_one/retire");
    expect(request?.method).toBe("POST");
    expect(request?.headers.get("authorization")).toBe("Bearer session-token");
    expect(request?.headers.get("content-type")).toBeNull();
  });

  test("rejects malformed API key identifiers without a request", async () => {
    let requests = 0;
    const client = createAccessClient({
      fetch: async () => {
        requests += 1;
        return new Response(null, { status: 204 });
      },
      origin: "https://access.merchbase.co",
    });

    expect(client.retireApiKey("session-token", "../key")).rejects.toMatchObject({
      kind: "not_found",
    });
    expect(requests).toBe(0);
  });
});
