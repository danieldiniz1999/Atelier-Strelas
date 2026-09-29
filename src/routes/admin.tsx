import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
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
  adminUploadProductImage,
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

    await ensureBootstrap();

    const raw = username.trim().toLowerCase();
    const email = raw.includes("@") ? raw : `${raw}@strelas.local`;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("Usuário ou senha incorretos.");
      return;
    }
    toast.success("Login realizado com sucesso!");
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
      toast.error(e.message ?? "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteFn({ data: { id } });
      toast.success("Produto excluído com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await router.invalidate();
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao excluir.");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === "all" || p.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCount = products.filter((p) => p.is_active).length;
  const featuredCount = products.filter((p) => p.is_featured).length;

  return (
    <div className="min-h-screen bg-[var(--brand-salmon)]/10 pb-12">
      <Toaster richColors position="top-center" />
      <header className="border-b border-border bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logoStrelas.url} alt="Atelier Strelas" className="h-9 w-9 object-contain" />
            <div>
              <span className="font-display text-lg font-bold text-foreground">Painel Administrativo</span>
              <span className="hidden sm:inline-block ml-2 rounded-full bg-[var(--brand-salmon)]/30 px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-pink)]">
                Atelier Strelas
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex text-xs font-semibold text-foreground/70 hover:text-[var(--brand-pink)] transition-colors"
            >
              Ver Loja ↗
            </a>
            <a
              href="/catalogo"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex text-xs font-semibold text-foreground/70 hover:text-[var(--brand-pink)] transition-colors"
            >
              Ver Catálogo ↗
            </a>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-1 text-xs">
              <LogOut className="h-3.5 w-3.5" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* STATS CARDS */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-6">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Total</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-foreground">{products.length}</div>
            <span className="text-xs text-foreground/50">produtos cadastrados</span>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Ativos</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-green-700">{activeCount}</div>
            <span className="text-xs text-foreground/50">visíveis no catálogo</span>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold text-[var(--brand-orange)] uppercase tracking-wider">Destaques</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-[var(--brand-orange)]">{featuredCount}</div>
            <span className="text-xs text-foreground/50">na página inicial</span>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-foreground">Gerenciar Produtos</h2>
            <p className="text-xs text-foreground/60">Cadastre, edite fotos, preços e categorias da sua loja.</p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-brand-gradient text-white shadow-md hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Novo produto
          </Button>
        </div>

        {showForm && (
          <ProductForm
            product={editing}
            categories={categories}
            onClose={() => setShowForm(false)}
            onSaved={async () => {
              setShowForm(false);
              await queryClient.invalidateQueries({ queryKey: ["products"] });
              await queryClient.invalidateQueries({ queryKey: ["featured-products"] });
              await queryClient.invalidateQueries({ queryKey: ["categories"] });
              await router.invalidate();
              refresh();
            }}
          />
        )}

        {/* BARRA DE BUSCA E FILTROS */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-white px-3 text-sm font-medium"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-pink)]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-foreground/60">
            {products.length === 0
              ? "Nenhum produto cadastrado ainda. Clique em 'Novo produto' acima para começar!"
              : "Nenhum produto encontrado com os filtros atuais."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-[var(--brand-salmon)]/15 text-left">
                <tr>
                  <th className="px-4 py-3 font-display font-bold">Produto</th>
                  <th className="px-4 py-3 font-display font-bold">Categoria</th>
                  <th className="px-4 py-3 font-display font-bold">Preço</th>
                  <th className="px-4 py-3 font-display font-bold">Ordem</th>
                  <th className="px-4 py-3 font-display font-bold">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-[var(--brand-salmon)]/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--brand-salmon)]/20 border border-border">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-foreground/40">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{p.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.is_featured && (
                              <span className="text-[11px] font-bold text-[var(--brand-orange)]">
                                ★ Destaque na Home
                              </span>
                            )}
                            {p.image_urls && p.image_urls.length > 1 && (
                              <span className="text-[10px] text-foreground/50">
                                ({p.image_urls.length} fotos)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground/80 font-medium">
                      {p.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--brand-pink)]">
                      {p.price !== null ? `R$ ${Number(p.price).toFixed(2).replace(".", ",")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground/60 text-xs">
                      #{p.display_order ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Editar produto"
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
                          title="Excluir produto"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
  const uploadFn = useServerFn(adminUploadProductImage);
  const MAX_IMAGES = 5;
  const initialImages = (() => {
    if (product?.image_urls && product.image_urls.length > 0) return product.image_urls;
    if (product?.image_url) return [product.image_url];
    return [] as string[];
  })();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product?.price !== null && product?.price !== undefined
      ? Number(product.price).toFixed(2).replace(".", ",")
      : ""
  );
  const [displayOrder, setDisplayOrder] = useState(product?.display_order?.toString() ?? "0");
  const [images, setImages] = useState<string[]>(initialImages);
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function compressAndOptimizeImage(
    file: File,
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82
  ): Promise<{ fileBase64: string; fileName: string; contentType: string }> {
    return new Promise((resolve, reject) => {
      // Se não for imagem comum ou for svg/gif, converte direto
      if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(",")[1] ?? res;
          resolve({ fileBase64: base64, fileName: file.name, contentType: file.type || "image/jpeg" });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        // Redimensiona mantendo proporção e alta fidelidade para retina/mobile
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Contexto gráfico não disponível."));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Gera em WebP ultraleve (com fallback para JPEG)
        let contentType = "image/webp";
        let dataUrl = canvas.toDataURL("image/webp", quality);

        if (!dataUrl.startsWith("data:image/webp")) {
          contentType = "image/jpeg";
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        const base64 = dataUrl.split(",")[1] ?? dataUrl;
        const dotIndex = file.name.lastIndexOf(".");
        const baseName = (dotIndex !== -1 ? file.name.slice(0, dotIndex) : file.name)
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .toLowerCase();
        const ext = contentType === "image/webp" ? "webp" : "jpg";

        resolve({
          fileBase64: base64,
          fileName: `${baseName}.${ext}`,
          contentType,
        });
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };

      img.src = objectUrl;
    });
  }

  async function handleFilesUpload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens por produto.`);
      return;
    }
    const toUpload = list.slice(0, remaining);
    if (list.length > remaining) {
      toast.message(`Você selecionou ${list.length} arquivos, mas só ${remaining} couberam (limite ${MAX_IMAGES}).`);
    }

    setUploading(true);
    setUploadProgress(toUpload.length === 1 ? "Otimizando foto..." : `Otimizando 1 de ${toUpload.length}...`);

    try {
      // Otimização e upload paralelo instantâneo
      let done = 0;
      const uploadTasks = toUpload.map(async (file, idx) => {
        const optimized = await compressAndOptimizeImage(file);
        setUploadProgress(
          toUpload.length === 1
            ? "Enviando em alta velocidade..."
            : `Enviando ${idx + 1} de ${toUpload.length}...`
        );
        const res = await uploadFn({
          data: {
            fileName: optimized.fileName,
            fileBase64: optimized.fileBase64,
            contentType: optimized.contentType,
          },
        });
        done++;
        setUploadProgress(
          done === toUpload.length
            ? "Concluindo..."
            : `Enviadas ${done} de ${toUpload.length}...`
        );
        return res?.url;
      });

      const uploaded = await Promise.all(uploadTasks);
      const validUrls = uploaded.filter((url): url is string => Boolean(url));

      setImages((prev) => [...prev, ...validUrls].slice(0, MAX_IMAGES));
      toast.success(
        validUrls.length === 1
          ? "Imagem otimizada e carregada com sucesso!"
          : `${validUrls.length} imagens otimizadas e carregadas!`
      );
    } catch (e: any) {
      console.error("Upload error:", e);
      toast.error(e.message ?? "Falha ao enviar imagem.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    setImages((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      copy.unshift(chosen);
      return copy;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, informe o nome do produto.");
      return;
    }
    setSaving(true);
    try {
      const cleanPrice = price ? price.replace(/\./g, "").replace(",", ".").trim() : null;
      await upsertFn({
        data: {
          id: product?.id,
          name: name.trim(),
          description: description.trim() || null,
          price: cleanPrice && !isNaN(Number(cleanPrice)) ? Number(cleanPrice) : null,
          image_url: images[0] ?? null,
          image_urls: images,
          category_id: categoryId || null,
          is_featured: isFeatured,
          is_active: isActive,
          display_order: displayOrder ? parseInt(displayOrder, 10) : 0,
        },
      });
      toast.success(product ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");
      onSaved();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-display text-lg font-bold text-foreground">
          {product ? "Editar produto" : "Cadastrar novo produto"}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
      </div>

      <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label>Nome do produto *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mochilinha Jardim Encantado"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Confeccionada em tecido premium com alças reforçadas..."
          />
        </div>
        <div>
          <Label>Preço (R$)</Label>
          <Input
            type="text"
            placeholder="Ex: 49,90"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <Label>Ordem de exibição</Label>
          <Input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            placeholder="0 (menor aparece primeiro)"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Categoria</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium"
          >
            <option value="">— Sem categoria —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Imagens do produto (até {MAX_IMAGES})</Label>
          <p className="mt-1 text-xs text-foreground/60">
            A primeira imagem é a capa exibida no site. Você pode reordenar definindo outra como capa.
          </p>
          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files;
              if (f && f.length > 0) handleFilesUpload(f);
              e.target.value = "";
            }}
          />

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {images.map((url, idx) => (
                <div
                  key={url + idx}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary shadow-sm"
                >
                  <img src={url} alt={`Imagem ${idx + 1}`} className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-white shadow">
                      Capa
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 px-1.5 py-1 opacity-0 transition group-hover:opacity-100">
                    {idx > 0 ? (
                      <button
                        type="button"
                        onClick={() => makeCover(idx)}
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-white/15"
                      >
                        Tornar capa
                      </button>
                    ) : <span />}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label="Remover imagem"
                      className="rounded p-1 text-white hover:bg-white/15"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
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
                const f = e.dataTransfer.files;
                if (f && f.length > 0) handleFilesUpload(f);
              }}
              className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[var(--brand-salmon)]/5 px-6 py-6 text-center transition hover:border-[var(--brand-pink)] hover:bg-[var(--brand-salmon)]/15"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-[var(--brand-pink)]" />
                  <span className="text-sm font-semibold text-foreground/80">
                    {uploadProgress ?? "Otimizando e enviando imagens..."}
                  </span>
                  <span className="text-[11px] text-foreground/50">
                    Processamento ultrarrápido em segundo plano
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-sm font-bold">
                    {images.length === 0
                      ? "Clique ou arraste para enviar imagens"
                      : `Adicionar mais (${MAX_IMAGES - images.length} restante${MAX_IMAGES - images.length === 1 ? "" : "s"})`}
                  </span>
                  <span className="text-xs text-foreground/60">PNG, JPG ou WEBP — você pode selecionar várias de uma vez</span>
                </>
              )}
            </label>
          )}

          {images.length >= MAX_IMAGES && (
            <p className="mt-3 rounded-lg bg-[var(--brand-salmon)]/15 px-3 py-2 text-xs font-semibold text-foreground/70">
              Limite de {MAX_IMAGES} imagens atingido. Remova alguma para adicionar outra.
            </p>
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
