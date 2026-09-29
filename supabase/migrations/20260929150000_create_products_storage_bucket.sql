-- Criação do Bucket de Armazenamento para Produtos e Políticas de Segurança RLS

-- 1. Garante que o bucket 'products' exista e seja público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products',
    'products',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760;

-- 2. Políticas de Acesso para storage.objects
DO $$ BEGIN
    -- Leitura pública para que os visitantes da loja vejam as fotos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read products bucket') THEN
        CREATE POLICY "Public read products bucket" ON storage.objects
            FOR SELECT TO anon, authenticated
            USING (bucket_id = 'products');
    END IF;

    -- Upload permitido para usuários autenticados
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins and users upload products') THEN
        CREATE POLICY "Admins and users upload products" ON storage.objects
            FOR INSERT TO authenticated
            WITH CHECK (bucket_id = 'products');
    END IF;

    -- Atualização permitida para usuários autenticados
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins update products') THEN
        CREATE POLICY "Admins update products" ON storage.objects
            FOR UPDATE TO authenticated
            USING (bucket_id = 'products')
            WITH CHECK (bucket_id = 'products');
    END IF;

    -- Exclusão permitida para usuários autenticados
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins delete products') THEN
        CREATE POLICY "Admins delete products" ON storage.objects
            FOR DELETE TO authenticated
            USING (bucket_id = 'products');
    END IF;
END $$;
