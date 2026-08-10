import { supabase } from "@/integrations/supabase/client";
import { generateCategoryImage } from "@/lib/ai-images.functions";

export async function updateCategoryImagesWithAI() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, description");
  
  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  for (const cat of categories) {
    try {
      console.log(`Generating image for: ${cat.name}`);
      const { url } = await generateCategoryImage({ data: { categoryName: cat.name, description: cat.description } });
      
      // Update categories table if we had an image_url column, but we don't.
      // We'll use a local mapping or add the column.
      // For now, let's just log and see if it works.
      console.log(`Generated URL for ${cat.name}: ${url}`);
    } catch (e) {
      console.error(`Failed for ${cat.name}:`, e);
    }
  }
}
