
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}';

-- Preenche image_urls com a image_url atual quando vazio (migração de dados existentes)
UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

-- Garante no máximo 5 imagens por produto
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_image_urls_max_5;
ALTER TABLE public.products
  ADD CONSTRAINT products_image_urls_max_5
  CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 5);
