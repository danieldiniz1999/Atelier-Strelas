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
      
      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: url } as any)
        .eq("id", cat.id);

      if (updateError) console.error(`Error updating ${cat.name}:`, updateError);
      console.log(`Updated ${cat.name} with AI image.`);
    } catch (e) {
      console.error(`Failed for ${cat.name}:`, e);
    }
  }
}
