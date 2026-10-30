import { expect, test } from "bun:test";
import { signInTarget } from "./sign-in-target";
test("preserves only local account return destinations", () => {
  expect(signInTarget("?return_url=%2Faccount%2Fapi-keys%2F")).toBe("/account/api-keys/");
  expect(signInTarget("?redirect_url=%2Faccount%2Faccess%2F%23details")).toBe(
    "/account/access/#details",
  );
});
test.each([
  "https://evil.example/account",
  "//evil.example/account",
  "/\\evil.example",
  "/sign-in",
  "/account/api/me",
  "/account/../sign-in",
  "javascript:alert(1)",
  "/account\n/other",
])("rejects unsafe return URL", (target) => {
  expect(signInTarget(`?return_url=${encodeURIComponent(target)}`)).toBe("/account/");
});
