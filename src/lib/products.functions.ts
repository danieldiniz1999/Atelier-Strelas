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

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Bolsinhas", slug: "bolsinhas", description: null, display_order: 1, image_url: "/cat-bolsinhas.jpg" },
  { id: "cat-2", name: "Mochilinhas", slug: "mochilinhas", description: null, display_order: 2, image_url: "/cat-mochilinhas.jpg" },
  { id: "cat-3", name: "Necessaires & Frasqueiras", slug: "necessaires", description: null, display_order: 3, image_url: "/cat-necessaires.jpg" },
  { id: "cat-4", name: "Kits Luxo", slug: "kits-luxo", description: null, display_order: 4, image_url: null },
  { id: "cat-5", name: "Estojos", slug: "estojos", description: null, display_order: 5, image_url: null },
  { id: "cat-6", name: "Maletas", slug: "maletas", description: null, display_order: 6, image_url: "/cat-maletas.jpg" },
];

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("categories")
    .select("id, name, slug, description, display_order, image_url")
    .order("display_order", { ascending: true });
  if (error || !data || data.length === 0) return { categories: DEFAULT_CATEGORIES };
  return { categories: data };
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
