export type Lang = "en" | "es";
export const defaultLang: Lang = "es";
export const supportedLangs: Lang[] = ["en", "es"];

const ADMIN_API_URL = process.env.ADMIN_API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

// Cache en memoria con TTL de 60 segundos
interface CacheEntry {
  data: unknown;
  ts: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60_000;

/**
 * Precarga y cachea los datos del portfolio desde el Admin API.
 * Llamar en el frontmatter de la página antes de pasar lang a los componentes.
 */
export async function getTranslations(lang: Lang): Promise<unknown> {
  const key = `portfolio_${lang}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  if (!ADMIN_API_URL || !INTERNAL_API_KEY) {
    throw new Error(
      `[i18n] Missing env vars — ADMIN_API_URL: ${!!ADMIN_API_URL}, INTERNAL_API_KEY: ${!!INTERNAL_API_KEY}. Cannot fetch portfolio data.`,
    );
  }

  try {
    // Trailing slash requerido porque Next.js (admin) tiene trailingSlash: true
    const url = `${ADMIN_API_URL}/api/v1/portfolio/${lang}/`;
    console.log(`[i18n] Fetching ${url}`);
    const res = await fetch(url, {
      headers: {
        "X-API-Key": INTERNAL_API_KEY,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    cache.set(key, { data, ts: Date.now() });
    return data;
  } catch (err) {
    console.error(`[i18n] Error fetching ${lang}:`, err);
    const stale = cache.get(key);
    if (stale) return stale.data;
    throw err;
  }
}

/**
 * Retorna los datos cacheados sincronamente.
 * Requiere haber llamado getTranslations(lang) antes.
 */
export function useTranslations(lang: Lang): any {
  const cached = cache.get(`portfolio_${lang}`);
  if (!cached) {
    throw new Error(
      `[i18n] No cached data for "${lang}". Call getTranslations(lang) first.`,
    );
  }
  return cached.data;
}

// Helpers sin cambios
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang === "en" || lang === "es") return lang as Lang;
  return defaultLang;
}

export function getLocalizedPath(lang: Lang, path: string = ""): string {
  return `/${lang}${path ? `/${path}` : ""}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}
