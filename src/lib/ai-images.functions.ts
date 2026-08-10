import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const generateCategoryImage = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ categoryName: z.string(), description: z.string().nullable() }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || "https://syxhnmjmwxtlnsozrnwz.supabase.co";
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");
    if (!supabaseServiceRole) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");

    const prompt = `High-end, premium product photography of ${data.categoryName} for children's luxury party favors. ${data.description || ""}. Clean, minimalist pastel background, studio lighting, soft textures, professional branding, realistic.`;
    
    console.log(`[AI-GEN] Requesting image for: ${data.categoryName}`);

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
      console.error("[AI-GEN] API failure:", err);
      throw new Error(`Failed to generate: ${err}`);
    }

    const result = await response.json();
    const url = result.data[0].url;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
      auth: { persistSession: false }
    });
    
    const { error: updateError } = await supabaseAdmin
      .from("categories")
      .update({ image_url: url })
      .eq("name", data.categoryName);

    if (updateError) {
      console.error(`[AI-GEN] DB Update Error for ${data.categoryName}:`, updateError);
    } else {
      console.log(`[AI-GEN] Persisted ${data.categoryName} -> ${url}`);
    }

    return { url };
  });
