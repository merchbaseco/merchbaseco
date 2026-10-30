import {
  AccessClientError,
  type ApiKeyMetadata,
  type CreatedApiKey,
  createAccessClient,
} from "@/lib/access-client";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "./account-ui";
import { NewApiKey } from "./new-api-key";

type KeyList =
  | { kind: "loading" }
  | { kind: "ready"; keys: ApiKeyMetadata[] }
  | { kind: "error"; error: AccessClientError };
export const ApiKeysSection = ({ canCreate }: { canCreate: boolean }) => {
  const [list, setList] = useState<KeyList>({ kind: "loading" });
  const [name, setName] = useState("");
  const [days, setDays] = useState("90");
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const active = useRef(true);
  const working = useRef(false);
  const refresh = useCallback(async () => {
    try {
      const keys = await createAccessClient().listApiKeys();
      if (active.current) setList({ kind: "ready", keys });
    } catch (error) {
      if (active.current)
        setList({
          kind: "error",
          error: error instanceof AccessClientError ? error : new AccessClientError("unavailable"),
        });
    }
  }, []);
  useEffect(() => {
    active.current = true;
    void refresh();
    const hide = () => {
      active.current = false;
      setCreated(null);
      setCopied(false);
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", restore);
    window.addEventListener("pagehide", hide);
    return () => {
      hide();
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", restore);
    };
  }, [refresh]);
  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (working.current || !name.trim() || !canCreate) return;
    working.current = true;
    setBusy("create");
    setError(null);
    setNotice(null);
    setCreated(null);
    setCopied(false);
    try {
      const key = await createAccessClient().createApiKey({
        name: name.trim(),
        expiresAt: days === "never" ? null : Date.now() + Number(days) * 86_400_000,
      });
      if (!active.current) return;
      setCreated(key);
      setName("");
      await refresh();
    } catch (caught) {
      if (active.current)
        setError(
          caught instanceof AccessClientError && caught.kind !== "unavailable"
            ? caught.message
            : "Could not confirm key creation. Refresh the key list before creating another key; a key may already have been created.",
        );
    } finally {
      working.current = false;
      if (active.current) setBusy(null);
    }
  };
  const retire = async (key: ApiKeyMetadata) => {
    if (working.current) return;
    working.current = true;
    setBusy(key.providerId);
    setError(null);
    setNotice(null);
    try {
      await createAccessClient().retireApiKey(key.providerId);
      if (!active.current) return;
      setConfirming(null);
      setNotice(`${key.name} was retired.`);
      if (created?.metadata.providerId === key.providerId) setCreated(null);
      await refresh();
    } catch (caught) {
      if (active.current)
        setError(
          caught instanceof AccessClientError
            ? caught.message
            : "Could not retire the key. Refresh the list and try again.",
        );
    } finally {
      working.current = false;
      if (active.current) setBusy(null);
    }
  };
  const copy = async () => {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.apiKey);
      if (active.current) setCopied(true);
    } catch {
      if (active.current) setError("Could not copy the key. Select and copy it manually.");
    }
  };
  const keys = list.kind === "ready" ? list.keys.filter((key) => key.retiredAt === null) : [];
  return (
    <section aria-labelledby="api-keys-title">
      <SectionHeading
        id="api-keys-title"
        title="API keys"
        description="One key works across Merchbase products your account can access."
      />
      <p className="mt-6 rounded-2xl bg-[#FFF3ED] p-5 text-base/7 text-[#612205] sm:text-sm/6">
        Treat API keys like passwords. Retiring a key stops it from being used as access updates
        reach your products. Product access and key expiry are separate.
      </p>
      {error ? (
        <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      {notice ? (
        <output className="mt-5 block rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          {notice}
        </output>
      ) : null}
      {created ? (
        <NewApiKey
          created={created}
          copied={copied}
          onCopy={() => void copy()}
          onClose={() => {
            setCreated(null);
            setCopied(false);
          }}
        />
      ) : null}
      <form className="mt-8 grid gap-5 rounded-3xl border border-gray-950/10 p-6" onSubmit={create}>
        <div>
          <h2 className="font-display text-xl font-semibold text-gray-950">Create a key</h2>
          <p className="mt-1 text-base/7 text-gray-600 sm:text-sm/6">
            Choose a name and expiry for this client or environment.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-medium text-gray-900">
          Name
          <input
            className="min-h-11 rounded-xl border border-gray-950/15 px-3 text-base font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
            maxLength={128}
            onChange={(event) => setName(event.target.value)}
            placeholder="MacBook CLI"
            required
            value={name}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-gray-900">
          Expires after
          <select
            className="min-h-11 rounded-xl border border-gray-950/15 bg-white px-3 text-base font-normal"
            value={days}
            onChange={(event) => setDays(event.target.value)}
          >
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">1 year</option>
            <option value="never">Never</option>
          </select>
        </label>
        {!canCreate ? (
          <p className="text-sm text-gray-600">
            Current Merchbase access is required to create a key. You can still retire existing keys
            below.
          </p>
        ) : null}
        <div>
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy !== null || !name.trim() || !canCreate}
          >
            {busy === "create" ? "Creating…" : "Create API key"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-950">
            Keys{list.kind === "ready" ? ` (${keys.length})` : ""}
          </h2>
          <button
            type="button"
            className="min-h-11 rounded-xl px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            disabled={busy !== null}
            onClick={() => void refresh()}
          >
            Refresh list
          </button>
        </div>
        {list.kind === "loading" ? (
          <div
            aria-label="Loading API keys"
            className="mt-5 h-28 animate-pulse rounded-3xl bg-gray-50"
          />
        ) : list.kind === "error" ? (
          <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-5 text-sm text-red-900">
            {list.error.message}
            {list.error.kind === "unauthenticated" ? (
              <a className="ml-2 underline" href="/account/api-keys/">
                Sign in again
              </a>
            ) : null}
          </p>
        ) : keys.length === 0 ? (
          <p className="mt-5 rounded-3xl bg-gray-50 p-6 text-base/7 text-gray-600 sm:text-sm/6">
            No unretired API keys. Create a key above when you need a script or integration to sign
            in.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-gray-950/10 border-y border-gray-950/10">
            {keys.map((key) => (
              <li
                key={key.providerId}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-950">{key.name}</p>
                  <p className="mt-2 text-xs/6 text-gray-500">
                    Created {new Date(key.createdAt).toLocaleDateString()} ·{" "}
                    {key.expiresAt === null
                      ? "No expiry"
                      : `${key.expiresAt <= Date.now() ? "Expired" : "Expires"} ${new Date(key.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
                {confirming === key.providerId ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Retire {key.name}?</span>
                    <button
                      type="button"
                      className="min-h-11 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      disabled={busy !== null}
                      onClick={() => setConfirming(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="min-h-11 rounded-lg bg-red-600 px-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                      disabled={busy !== null}
                      onClick={() => void retire(key)}
                    >
                      {busy === key.providerId ? "Retiring…" : "Retire key"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="min-h-11 self-start rounded-lg px-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    disabled={busy !== null}
                    onClick={() => setConfirming(key.providerId)}
                  >
                    Retire
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {list.kind === "ready" && list.keys.some((key) => key.retiredAt !== null) ? (
          <details className="mt-6 text-sm text-gray-600">
            <summary className="cursor-pointer py-3 font-medium">
              Retired keys ({list.keys.filter((key) => key.retiredAt !== null).length})
            </summary>
            <ul>
              {list.keys
                .filter((key) => key.retiredAt !== null)
                .map((key) => (
                  <li className="py-2" key={key.providerId}>
                    {key.name} · Retired{" "}
                    {new Date(key.retiredAt ?? key.createdAt).toLocaleDateString()}
                  </li>
                ))}
            </ul>
          </details>
        ) : null}
      </div>
    </section>
  );
};
