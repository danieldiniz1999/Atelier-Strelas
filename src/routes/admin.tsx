import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast, Toaster } from "sonner";
import { LogOut, Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  adminListProducts,
  adminUpsertProduct,
  adminDeleteProduct,
  adminListCategories,
} from "@/lib/admin-products.functions";
import logoPrincipal from "@/assets/logo-principal.png.asset.json";
import logoStrelas from "@/assets/logo-strelas.png.asset.json";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel — Atelier Strelas" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),

  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<"loading" | "in" | "out">("loading");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Tenta garantir que os usuários iniciais existam (idempotente).
    fetch("/api/public/bootstrap-admins").catch(() => {});

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user) {
        setSession("in");
        checkAdmin(s.user.id);
      } else {
        setSession("out");
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession("in");
        checkAdmin(data.session.user.id);
      } else {
        setSession("out");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string) {
    const { data } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    setIsAdmin(Boolean(data));
  }

  if (session === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-pink)]" />
      </div>
    );
  }

  if (session === "out") return <LoginScreen />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-display text-xl font-bold">Sua conta não tem acesso ao painel.</p>
        <Button
          onClick={() => supabase.auth.signOut()}
          variant="outline"
        >
          Sair
        </Button>
      </div>
    );
  }

  return <Dashboard />;
}

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const bootstrapped = useRef(false);

  async function ensureBootstrap() {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    try {
      await fetch("/api/public/bootstrap-admins");
    } catch {
      // ignore
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Garante que os usuários existem antes do primeiro login
    await ensureBootstrap();

    const email = `${username.trim().toLowerCase()}@strelas.local`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("Usuário ou senha inválidos.");
      return;
    }
    toast.success("Bem-vindo(a)!");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-salmon)]/15 px-4">
      <Toaster richColors position="top-center" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <img
            src={logoStrelas.url}
            alt="Atelier Strelas"
            className="mx-auto mb-4 h-28 w-28 object-contain"
          />
          <h1 className="font-display text-2xl font-extrabold">Painel Atelier Strelas</h1>
          <p className="mt-1 text-sm text-foreground/60">Acesso restrito</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient text-white hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  category_id: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  categories?: { name: string; slug: string } | null;
};
type Category = { id: string; name: string; slug: string };

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const listFn = useServerFn(adminListProducts);
  const listCatFn = useServerFn(adminListCategories);
  const deleteFn = useServerFn(adminDeleteProduct);

  async function refresh() {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([listFn(), listCatFn()]);
      setProducts(p.products as Product[]);
      setCategories(c.categories as Category[]);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    try {
      await deleteFn({ data: { id } });
      toast.success("Produto excluído.");
      refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-[var(--brand-salmon)]/10">
      <Toaster richColors position="top-center" />
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <img src={logoStrelas.url} alt="Atelier Strelas" className="h-10 w-10 object-contain" />
            Painel Strelas
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-extrabold">Produtos</h2>
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-brand-gradient text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Novo produto
          </Button>
        </div>

        {showForm && (
          <ProductForm
            product={editing}
            categories={categories}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              refresh();
            }}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--brand-pink)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-foreground/60">
            Nenhum produto cadastrado. Clique em "Novo produto" para começar.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[var(--brand-salmon)]/15 text-left">
                <tr>
                  <th className="px-4 py-3 font-display font-bold">Produto</th>
                  <th className="px-4 py-3 font-display font-bold">Categoria</th>
                  <th className="px-4 py-3 font-display font-bold">Preço</th>
                  <th className="px-4 py-3 font-display font-bold">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-[var(--brand-salmon)]/20">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-foreground/40">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          {p.is_featured && (
                            <span className="text-xs font-semibold text-[var(--brand-orange)]">
                              ★ Destaque
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {p.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--brand-pink)]">
                      {p.price !== null ? `R$ ${Number(p.price).toFixed(2).replace(".", ",")}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const upsertFn = useServerFn(adminUpsertProduct);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = await supabase.storage.from("products").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (data?.signedUrl) setImageUrl(data.signedUrl);
      toast.success("Imagem enviada!");
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertFn({
        data: {
          id: product?.id,
          name,
          description: description || null,
          price: price ? Number(price) : null,
          image_url: imageUrl || null,
          category_id: categoryId || null,
          is_featured: isFeatured,
          is_active: isActive,
        },
      });
      toast.success(product ? "Produto atualizado!" : "Produto cadastrado!");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">
          {product ? "Editar produto" : "Novo produto"}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
      </div>

      <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label>Nome *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Preço (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Categoria</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">— Sem categoria —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Imagem do produto</Label>
          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
              e.target.value = "";
            }}
          />
          {imageUrl ? (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
                <img src={imageUrl} alt="Pré-visualização" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById("product-image-input")?.click()}
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><ImageIcon className="h-4 w-4" /> Trocar imagem</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageUrl("")}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Remover
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="product-image-input"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-[var(--brand-pink)]", "bg-[var(--brand-salmon)]/20");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-[var(--brand-pink)]", "bg-[var(--brand-salmon)]/20");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-[var(--brand-pink)]", "bg-[var(--brand-salmon)]/20");
                const f = e.dataTransfer.files?.[0];
                if (f) handleFileUpload(f);
              }}
              className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[var(--brand-salmon)]/5 px-6 py-8 text-center transition hover:border-[var(--brand-pink)] hover:bg-[var(--brand-salmon)]/15"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-pink)]" />
                  <span className="text-sm font-semibold text-foreground/70">Enviando imagem...</span>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-sm font-bold">
                    Clique para escolher ou arraste uma imagem
                  </span>
                  <span className="text-xs text-foreground/60">PNG, JPG ou WEBP — até 5MB</span>
                </>
              )}
            </label>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="featured">Mostrar como destaque na home</Label>
        </div>
        <div className="md:col-span-2">
          <Label>Status do produto</Label>
          <div className="mt-2 flex flex-col gap-3 rounded-xl border border-border bg-[var(--brand-salmon)]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="font-display font-bold">
                  {isActive ? "Ativo — visível no site" : "Desativado — oculto do site"}
                </span>
              </div>
              <p className="mt-1 text-xs text-foreground/60">
                Desative para esconder do catálogo sem excluir. Você pode reativar a qualquer momento.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label={isActive ? "Desativar produto" : "Ativar produto"}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-brand-gradient text-white hover:opacity-90"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
