import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const generateCategoryImage = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ categoryName: z.string(), description: z.string().nullable() }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Premium product photography of ${data.categoryName} for children's parties. ${data.description || ""}. High quality, soft pastel lighting, atelier style, colorful, clean background, realistic textures.`;
    
    console.log(`[AI-GEN] Requesting image for: ${data.categoryName} with prompt: ${prompt}`);

    const response = await fetch("https://api.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        model: "flux-schnell",
        n: 1,
        size: "1024x1024"
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[AI-GEN] API failed:", err);
      throw new Error("Failed to generate image");
    }

    const result = await response.json();
    const url = result.data[0].url;
    console.log(`[AI-GEN] Success! URL: ${url}`);

    // Persist immediately to be safe
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    
    await supabaseAdmin
      .from("categories")
      .update({ image_url: url })
      .eq("name", data.categoryName);

    return { url };
  });
