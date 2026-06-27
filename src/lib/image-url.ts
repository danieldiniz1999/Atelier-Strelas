/**
 * Otimiza URLs de imagens do Supabase Storage usando o endpoint
 * de transformação de imagem (redimensiona + comprime no CDN).
 * Para URLs que não sejam do Supabase Storage, devolve a URL original.
 */
export function optimizedImage(
  url: string | null | undefined,
  opts: { width?: number; quality?: number } = {},
): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!u.pathname.includes("/storage/v1/object/")) return url;
    // troca /object/ por /render/image/ (mesma assinatura/token funciona)
    u.pathname = u.pathname.replace("/storage/v1/object/", "/storage/v1/render/image/");
    if (opts.width) u.searchParams.set("width", String(opts.width));
    u.searchParams.set("quality", String(opts.quality ?? 70));
    u.searchParams.set("resize", "cover");
    return u.toString();
  } catch {
    return url;
  }
}

/** Gera srcset com vários tamanhos para responsividade. */
export function optimizedSrcSet(
  url: string | null | undefined,
  widths: number[] = [320, 480, 640, 800],
  quality = 70,
): string {
  if (!url) return "";
  return widths
    .map((w) => `${optimizedImage(url, { width: w, quality })} ${w}w`)
    .join(", ");
}
