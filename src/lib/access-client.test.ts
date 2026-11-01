import { describe, expect, test } from "bun:test";
import { type AccessProfile, createAccessClient } from "./access-client";
const profile = {
  access: "granted",
  accessValidUntil: null,
  merchbaseUserId: "mbu_test",
  services: {
    "merchbase-core": "granted",
    rankwrangler: "granted",
    tmterminal: "granted",
    bidbeacon: "granted",
    atlas: "granted",
    handmade: "granted",
    fulfillment: "granted",
    factory: "granted",
    "future-product": "not_granted",
  },
} satisfies AccessProfile;
const metadata = {
  clientId: "client.access",
  providerId: "provider_one",
  name: "Laptop",
  expiresAt: null,
  createdAt: 1_800_000_000_000,
  retiredAt: null,
};
describe("Account Center API", () => {
  test("uses same-origin cookies without sending browser bearer credentials", async () => {
    let url: unknown;
    let options: RequestInit | undefined;
    const client = createAccessClient({
      fetch: async (input, init) => {
        url = input;
        options = init;
        return Response.json(profile);
      },
    });
    expect(await client.me()).toEqual(profile);
    expect(url).toBe("/account/api/me");
    expect(options?.credentials).toBe("same-origin");
    expect(options?.cache).toBe("no-store");
    expect(options?.redirect).toBe("error");
    expect(new Headers(options?.headers).get("authorization")).toBeNull();
    expect(new Headers(options?.headers).get("X-Requested-With")).toBe("XMLHttpRequest");
  });
  test("validates each returned service while accepting future products", async () => {
    const client = createAccessClient({
      fetch: async () => Response.json({ ...profile, services: { atlas: "yes" } }),
    });
    await expect(client.me()).rejects.toMatchObject({ kind: "unavailable" });
  });
  test.each([
    {},
    { ...profile, services: {} },
    { ...profile, merchbaseUserId: "mbu_" },
    { ...profile, accessValidUntil: "invalid" },
  ])("rejects malformed profile", async (body) => {
    await expect(
      createAccessClient({ fetch: async () => Response.json(body) }).me(),
    ).rejects.toMatchObject({ kind: "unavailable" });
  });
  test.each([
    [401, "unauthenticated"],
    [403, "denied"],
    [404, "unavailable"],
    [503, "unavailable"],
  ])("maps safe HTTP failures", async (status, kind) => {
    await expect(
      createAccessClient({
        fetch: async () => new Response(null, { status: Number(status) }),
      }).me(),
    ).rejects.toMatchObject({ kind });
  });
  test("reads metadata without treating it as a secret", async () => {
    expect(
      await createAccessClient({
        fetch: async () => Response.json({ apiKeys: [metadata] }),
      }).listApiKeys(),
    ).toEqual([metadata]);
  });
  test("creates once with JSON and returns only the one-time key contract", async () => {
    const calls: RequestInit[] = [];
    const client = createAccessClient({
      fetch: async (_url, init) => {
        if (init) calls.push(init);
        return Response.json({ apiKey: "mbk_v1.ZmFrZQ", metadata });
      },
    });
    const created = await client.createApiKey({ name: "Laptop", expiresAt: null });
    expect(created.apiKey).toBe("mbk_v1.ZmFrZQ");
    expect(created.metadata).toEqual({
      clientId: metadata.clientId,
      providerId: metadata.providerId,
      name: metadata.name,
      expiresAt: null,
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.body).toBe(JSON.stringify({ name: "Laptop", expiresAt: null }));
  });
  test("never retries an uncertain creation", async () => {
    let calls = 0;
    const client = createAccessClient({
      fetch: async () => {
        calls++;
        throw new Error("provider-secret-must-not-escape");
      },
    });
    await expect(client.createApiKey({ name: "Laptop", expiresAt: null })).rejects.toMatchObject({
      kind: "unavailable",
    });
    expect(calls).toBe(1);
  });
  test("retires through the owner route with JSON for CSRF checks", async () => {
    let path: unknown;
    let options: RequestInit | undefined;
    await createAccessClient({
      fetch: async (url, init) => {
        path = url;
        options = init;
        return new Response(null, { status: 204 });
      },
    }).retireApiKey("provider_one");
    expect(path).toBe("/account/api/api-keys/provider_one/retire");
    expect(options?.body).toBe("{}");
    expect(new Headers(options?.headers).get("content-type")).toBe("application/json");
  });
  test("rejects path injection without a request", async () => {
    let calls = 0;
    await expect(
      createAccessClient({
        fetch: async () => {
          calls++;
          return new Response();
        },
      }).retireApiKey("../other"),
    ).rejects.toMatchObject({ kind: "not_found" });
    expect(calls).toBe(0);
  });
});
