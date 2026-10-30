const FALLBACK = "/account/";
export const signInTarget = (search: string): string => {
  const params = new URLSearchParams(search);
  const value = params.get("return_url") ?? params.get("redirect_url");
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    [...value].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)
  )
    return FALLBACK;
  try {
    const url = new URL(value, "https://merchbase.co");
    if (
      url.origin !== "https://merchbase.co" ||
      !/^\/account(?:\/|$)/u.test(url.pathname) ||
      /^\/account\/api(?:\/|$)/u.test(url.pathname)
    )
      return FALLBACK;
    return url.pathname + url.search + url.hash;
  } catch {
    return FALLBACK;
  }
};
