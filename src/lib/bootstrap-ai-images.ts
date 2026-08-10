import { createClient } from "@supabase/supabase-js";
import { generateCategoryImage } from "@/lib/ai-images.functions";

export async function updateCategoryImagesWithAI() {
  const supabaseUrl = process.env.SUPABASE_URL || "https://syxhnmjmwxtlnsozrnwz.supabase.co";
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceRole) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
    auth: { persistSession: false }
  });

  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, description");
  
  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  for (const cat of categories) {
    try {
      await generateCategoryImage({ data: { categoryName: cat.name, description: cat.description } });
    } catch (e) {
      console.error(`[AI-BOOTSTRAP] Failed for ${cat.name}:`, e);
    }
  }
}
