// Centralized site URL helper for Vercel and custom domains
export function getSiteUrl(): string {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.SITE_URL) {
      return process.env.SITE_URL.replace(/\/+$/, "");
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  }
  return "https://atelier-strelas.vercel.app";
}

export const BASE_SITE_URL = getSiteUrl();
