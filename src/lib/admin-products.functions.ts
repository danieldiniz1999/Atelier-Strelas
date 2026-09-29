import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const priceParser = z.union([z.number(), z.string(), z.null(), z.undefined()]).transform((val) => {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  const cleaned = val.replace(/\./g, "").replace(",", ".").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
});

const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome do produto é obrigatório").max(255),
  description: z.string().max(3000).optional().nullable(),
  price: priceParser.optional().nullable(),
  image_url: z.string().max(2000).nullable().optional(),
  image_urls: z.array(z.string().max(2000)).max(10).optional().default([]),
  category_id: z.string().uuid().nullable().optional().or(z.literal("")).transform((v) => (v ? v : null)),
  is_featured: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  display_order: z.union([z.number(), z.string(), z.null(), z.undefined()]).transform((v) => {
    if (!v) return 0;
    const n = parseInt(String(v), 10);
    return isNaN(n) ? 0 : n;
  }).optional(),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  try {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (data) return;
  } catch {
    // continua para o fallback
  }

  // Fallback seguro via service role
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleRow) return;
  } catch (err) {
    console.error("[Auth] Erro ao validar admin:", err);
  }

  throw new Error("Acesso negado: Requer perfil de administrador.");
}

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin || context.supabase;

    const { data, error } = await client
      .from("products")
      .select("*, categories(id, name, slug)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { products: data ?? [] };
  });

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin || context.supabase;

    const payload = {
      name: data.name,
      description: data.description ?? null,
      price: data.price ?? null,
      image_url: data.image_url ?? (data.image_urls?.[0] || null),
      image_urls: data.image_urls ?? [],
      category_id: data.category_id ?? null,
      is_featured: data.is_featured ?? false,
      is_active: data.is_active ?? true,
      display_order: data.display_order ?? 0,
    };

    if (data.id) {
      const { error } = await client.from("products").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }

    const { data: row, error } = await client
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row?.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin || context.supabase;

    const { error } = await client.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin || context.supabase;

    // Garante que as 6 categorias padrão existam no banco
    const STANDARD_CATEGORIES = [
      { name: "Bolsinhas", slug: "bolsinhas", display_order: 1 },
      { name: "Mochilinhas", slug: "mochilinhas", display_order: 2 },
      { name: "Necessaires", slug: "necessaires", display_order: 3 },
      { name: "Frasqueiras", slug: "frasqueiras", display_order: 4 },
      { name: "Kits Luxo & 3D", slug: "kits-luxo", display_order: 5 },
      { name: "Maletas", slug: "maletas", display_order: 6 },
    ];

    try {
      for (const cat of STANDARD_CATEGORIES) {
        await client
          .from("categories")
          .upsert(cat, { onConflict: "slug" });
      }
    } catch (e) {
      console.warn("[Categories] Auto-seed warning:", e);
    }

    const { data, error } = await client
      .from("categories")
      .select("id, name, slug, display_order")
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { categories: data ?? [] };
  });

export const adminUploadProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      fileName: z.string().min(1).max(255),
      fileBase64: z.string(),
      contentType: z.string().default("image/jpeg"),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Garante que o bucket 'products' exista de forma transparente
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === "products" || b.id === "products");
      if (!exists) {
        await supabaseAdmin.storage.createBucket("products", {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"],
        });
      }
    } catch (bucketErr) {
      console.warn("[Storage] Bucket check warning:", bucketErr);
    }

    const ext = data.fileName.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(data.fileBase64, "base64");

    const { error: uploadError } = await supabaseAdmin.storage
      .from("products")
      .upload(path, buffer, {
        contentType: data.contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Storage] Upload error:", uploadError);
      throw new Error(`Falha no upload: ${uploadError.message}`);
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(path);

    return {
      url: publicData.publicUrl,
      path,
    };
  });
