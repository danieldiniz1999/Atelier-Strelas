-- Migration de Blindagem e Segurança RLS (Row Level Security)

-- 1. Tabela user_roles
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- Revogar permissões diretas de mutação de papeis para anon e authenticated
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Políticas de segurança para user_roles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own role') THEN
        CREATE POLICY "Users can view own role" ON public.user_roles
            FOR SELECT TO authenticated
            USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage user_roles') THEN
        CREATE POLICY "Admins manage user_roles" ON public.user_roles
            FOR ALL TO authenticated
            USING (public.has_role(auth.uid(), 'admin'))
            WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- 2. Tabela categories
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

-- Revogar mutações diretas de categorias para anon e usuários autenticados comuns
REVOKE INSERT, UPDATE, DELETE ON public.categories FROM anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read categories') THEN
        CREATE POLICY "Public read categories" ON public.categories
            FOR SELECT TO anon, authenticated
            USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage categories') THEN
        CREATE POLICY "Admins manage categories" ON public.categories
            FOR ALL TO authenticated
            USING (public.has_role(auth.uid(), 'admin'))
            WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- 3. Tabela products
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

-- Revogar mutações diretas de produtos para anon e usuários autenticados comuns
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active products') THEN
        CREATE POLICY "Public read active products" ON public.products
            FOR SELECT TO anon, authenticated
            USING (is_active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins read all products') THEN
        CREATE POLICY "Admins read all products" ON public.products
            FOR SELECT TO authenticated
            USING (public.has_role(auth.uid(), 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage products') THEN
        CREATE POLICY "Admins manage products" ON public.products
            FOR ALL TO authenticated
            USING (public.has_role(auth.uid(), 'admin'))
            WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
