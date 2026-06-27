/**
 * Otimiza URLs de imagens do Supabase Storage usando o endpoint
 * de transformação de imagem (redimensiona + comprime + converte
 * para um formato moderno no CDN). Para URLs que não sejam do
 * Supabase Storage, devolve a URL original.
 */
export function optimizedImage(
  url: string | null | undefined,
  opts: { width?: number; quality?: number; format?: "webp" | "origin" } = {},
): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!u.pathname.includes("/storage/v1/object/")) return url;
    u.pathname = u.pathname.replace(
      "/storage/v1/object/",
      "/storage/v1/render/image/",
    );
    if (opts.width) u.searchParams.set("width", String(opts.width));
    u.searchParams.set("quality", String(opts.quality ?? 65));
    u.searchParams.set("resize", "cover");
    u.searchParams.set("format", opts.format ?? "webp");
    return u.toString();
  } catch {
    return url;
  }
}

/** Gera srcset com vários tamanhos para responsividade. */
export function optimizedSrcSet(
  url: string | null | undefined,
  widths: number[] = [240, 360, 480, 640],
  quality = 65,
): string {
  if (!url) return "";
  return widths
    .map((w) => `${optimizedImage(url, { width: w, quality })} ${w}w`)
    .join(", ");
}
