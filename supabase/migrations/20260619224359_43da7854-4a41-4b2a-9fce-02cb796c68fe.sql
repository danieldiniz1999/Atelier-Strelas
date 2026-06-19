
DELETE FROM public.categories;
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Mochilas', 'mochilas', 'Mochilas personalizadas', 1),
  ('Maletas', 'maletas', 'Maletas personalizadas', 2),
  ('Frasqueiras', 'frasqueiras', 'Frasqueiras personalizadas', 3),
  ('Brindes', 'brindes', 'Brindes personalizados', 4),
  ('Bolsas de luxo', 'bolsas-de-luxo', 'Bolsas de luxo personalizadas', 5);
