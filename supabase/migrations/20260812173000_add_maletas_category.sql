-- Inserir a nova categoria Maletas
INSERT INTO public.categories (name, slug, display_order) VALUES
('Maletas', 'maletas', 6)
ON CONFLICT (slug) DO NOTHING;
