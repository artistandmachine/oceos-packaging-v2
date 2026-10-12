import raw from "@/data/site.json";

/** Set when the site is served from a sub-path (GitHub Pages project
 * site: /oceos-packaging-v2). Empty locally and on a root domain. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Next adds basePath to its own routes and chunks, but not to plain
 * strings like the asset paths in site.json ("/images/...") that end up
 * in <img>, <video> and CSS masks. Prefix every root-relative file path
 * once here so components never have to think about it. */
function withBase<T>(v: T): T {
  if (!BASE_PATH) return v;
  if (typeof v === "string") return (/^\/(images|videos|brand)\//.test(v) ? BASE_PATH + v : v) as T;
  if (Array.isArray(v)) return v.map(withBase) as T;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withBase(x)])) as T;
  return v;
}

/** All site copy and asset paths (data/site.json), base-path aware.
 * Import this, not the JSON. */
const site = withBase(raw);
export default site;
