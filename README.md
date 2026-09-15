# Atelier Strelas 🌟

Website e catálogo interativo de lembrancinhas personalizadas para festas infantis.

## 🚀 Tecnologias
- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, Vite, TanStack Router)
- **Hospedagem & Deploy:** [Vercel](https://vercel.com)
- **Backend & Banco de Dados:** [Supabase](https://supabase.com)
- **Estilização:** Tailwind CSS v4, Lucide Icons, Radix UI

## 📦 Deploy na Vercel
1. Importe este repositório no dashboard da [Vercel](https://vercel.com/new).
2. A Vercel detectará automaticamente o framework como **TanStack Start**.
3. Adicione as seguintes **Variáveis de Ambiente** em *Project Settings > Environment Variables*:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_SERVICE_ROLE_KEY` *(Opcional, para operações administrativas)*
   - `SITE_URL` *(Opcional, seu domínio personalizado ou URL da Vercel)*
4. Clique em **Deploy**!

## 💻 Desenvolvimento Local
```sh
npm install
npm run dev
```
