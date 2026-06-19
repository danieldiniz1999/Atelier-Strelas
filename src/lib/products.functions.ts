import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("categories")
    .select("id, name, slug, description, display_order")
    .order("display_order", { ascending: true });
  if (error) return { categories: [] as Array<{ id: string; name: string; slug: string; description: string | null; display_order: number }> };
  return { categories: data ?? [] };
});

export const listFeaturedProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("products")
    .select("id, name, description, price, image_url, category_id, is_featured")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(8);
  if (error) return { products: [] };
  return { products: data ?? [] };
});

export const listAllActiveProducts = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ categorySlug: z.string().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    let query = sb
      .from("products")
      .select("id, name, description, price, image_url, category_id, is_featured, categories(slug, name)")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data.categorySlug) {
      // filter via category slug — need to fetch category id first
      const { data: cat } = await sb
        .from("categories")
        .select("id")
        .eq("slug", data.categorySlug)
        .maybeSingle();
      if (cat?.id) query = query.eq("category_id", cat.id);
    }

    const { data: rows, error } = await query;
    if (error) return { products: [] };
    return { products: rows ?? [] };
  });
