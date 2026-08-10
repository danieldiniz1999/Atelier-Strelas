import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MOCK_AI_IMAGES = {
  "Bolsinhas": "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1024&h=1024&auto=format&fit=crop",
  "Mochilinhas": "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1024&h=1024&auto=format&fit=crop",
  "Necessaires": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1024&h=1024&auto=format&fit=crop",
  "Kits Luxo": "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1024&h=1024&auto=format&fit=crop",
  "Estojos": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1024&h=1024&auto=format&fit=crop"
};

export const generateCategoryImage = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ categoryName: z.string(), description: z.string().nullable() }).parse(input))
  .handler(async ({ data }) => {
    const url = MOCK_AI_IMAGES[data.categoryName as keyof typeof MOCK_AI_IMAGES] || MOCK_AI_IMAGES["Bolsinhas"];
    return { url };
  });
