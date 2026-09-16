import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Acesso negado: apenas administradores podem gerar imagens.");
}

export const generateCategoryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      categoryName: z.string().min(1).max(100),
      description: z.string().max(500).nullable().optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada.");

    const prompt = `Premium product photography of ${data.categoryName} for children's parties. ${data.description || ""}. High quality, soft pastel lighting, atelier style, colorful, clean background, realistic textures.`;

    const response = await fetch("https://api.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: "flux-schnell",
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("AI Generation failed:", err);
      throw new Error("Falha ao gerar imagem.");
    }

    const result = await response.json();
    return { url: result.data[0].url };
  });
