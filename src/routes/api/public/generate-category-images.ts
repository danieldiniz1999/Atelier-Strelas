// Rota para disparar a geração de imagens de categorias via IA
import { createFileRoute } from "@tanstack/react-router";
import { updateCategoryImagesWithAI } from "@/lib/bootstrap-ai-images";

export const Route = createFileRoute("/api/public/generate-category-images")({
  server: {
    handlers: {
      POST: async () => {
        // Dispara em background para não travar a requisição
        updateCategoryImagesWithAI().catch(console.error);
        return Response.json({ ok: true, message: "Geração de imagens iniciada em segundo plano." });
      },
    },
  },
});
