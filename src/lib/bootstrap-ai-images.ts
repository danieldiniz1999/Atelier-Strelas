import { createClient } from "@supabase/supabase-js";
import { generateCategoryImage } from "@/lib/ai-images.functions";

export async function updateCategoryImagesWithAI() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, name, description");
  
  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  console.log(`[AI-BOOTSTRAP] Found ${categories.length} categories to process.`);

  // Process sequentially to avoid hitting rate limits too hard
  for (const cat of categories) {
    try {
      console.log(`[AI-BOOTSTRAP] Processing: ${cat.name}`);
      await generateCategoryImage({ data: { categoryName: cat.name, description: cat.description } });
    } catch (e) {
      console.error(`[AI-BOOTSTRAP] Failed for ${cat.name}:`, e);
    }
  }
}
