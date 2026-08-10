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
      console.log(`Generating image for category: ${cat.name}`);
      const result = await generateCategoryImage({ data: { categoryName: cat.name, description: cat.description } });
      
      if (!result || !result.url) {
        console.error(`No URL returned for ${cat.name}`);
        continue;
      }
      
      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: result.url } as any)
        .eq("id", cat.id);

      if (updateError) {
        console.error(`Error updating category ${cat.name} in DB:`, updateError);
      } else {
        console.log(`Successfully updated ${cat.name} with AI image: ${result.url}`);
      }
    } catch (e) {
      console.error(`Failed to process category ${cat.name}:`, e);
    }
  }
}
