import type { CreatedApiKey } from "@/lib/access-client";
import { useEffect, useRef } from "react";
export const NewApiKey = ({
  created,
  copied,
  onCopy,
  onClose,
}: { created: CreatedApiKey; copied: boolean; onCopy: () => void; onClose: () => void }) => {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  return (
    <div className="mt-8 rounded-3xl bg-[#E5EEFF] p-6 text-[#173A78]">
      <h2 className="font-display text-xl font-semibold">Copy {created.metadata.name} now</h2>
      <p className="mt-2 text-base/7 sm:text-sm/6">
        This secret is shown once. Store it securely before closing this panel.
      </p>
      <p className="mt-2 text-sm">
        {created.metadata.expiresAt === null
          ? "This key does not expire."
          : `This key expires ${new Date(created.metadata.expiresAt).toLocaleString()}.`}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="New API key"
          ref={input}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#173A78]/20 bg-white px-3 font-mono text-base text-gray-950 sm:text-sm focus:outline-blue-600"
          readOnly
          value={created.apiKey}
        />
        <button
          type="button"
          className="min-h-11 rounded-xl bg-[#173A78] px-4 text-sm font-medium text-white hover:bg-[#102B5B]"
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy key"}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-xl px-4 text-sm font-medium hover:bg-white/60"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};
