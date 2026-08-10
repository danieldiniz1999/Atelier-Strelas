import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { SellerPickerButton } from "@/components/seller-picker";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  listCategories,
  listAllActiveProducts,
} from "@/lib/products.functions";
import { optimizedImage, optimizedSrcSet } from "@/lib/image-url";

const searchSchema = z.object({
  categoria: z.string().optional(),
});

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories(),
});

function productsQuery(categoria?: string) {
  return queryOptions({
    queryKey: ["products", categoria ?? "all"],
    queryFn: () => listAllActiveProducts({ data: { categorySlug: categoria } }),
  });
}

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo de Lembrancinhas | Atelier Strelas" },
      {
        name: "description",
        content:
          "Explore nosso catálogo completo: mochilas, necessaires e bolsas personalizadas. Diversos temas e modelos para a festa do seu filho. Peça seu orçamento online!",
      },
      { property: "og:title", content: "Catálogo de Produtos | Atelier Strelas" },
      {
        property: "og:description",
        content: "Veja nossos modelos de bolsas e mochilas personalizadas. O detalhe que faz a diferença na sua festa.",
      },
      { property: "og:url", content: "https://atelier-strelas.lovable.app/catalogo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://atelier-strelas.lovable.app/catalogo" }],
  }),

  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ categoria: search.categoria }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery(deps.categoria)),
    ]);
  },
  component: CatalogoPage,
});

function CatalogoPage() {
  const { categoria } = Route.useSearch();
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: prods } = useSuspenseQuery(productsQuery(categoria));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <WhatsappFloat />

      <section className="relative overflow-hidden bg-[var(--brand-salmon)]/15 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-orange)]">
            Nosso catálogo
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground sm:text-5xl">
            Cada peça, uma <span className="text-brand-gradient">história</span>
          </h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Navegue pelas categorias e encontre a lembrancinha perfeita para o tema
            da festa da sua criança.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-2 py-3">
            <Link
              to="/catalogo"
              search={{}}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                !categoria
                  ? "bg-brand-gradient text-white shadow"
                  : "bg-white text-foreground/70 hover:text-[var(--brand-pink)]"
              }`}
            >
              Todos
            </Link>
            {cats.categories.map((c) => (
              <Link
                key={c.id}
                to="/catalogo"
                search={{ categoria: c.slug }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  categoria === c.slug
                    ? "bg-brand-gradient text-white shadow"
                    : "bg-white text-foreground/70 hover:text-[var(--brand-pink)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {prods.products.length === 0 ? (
          <ScrollReveal>
            <div className="rounded-2xl border-2 border-dashed border-[var(--brand-salmon)]/40 bg-white p-16 text-center">
              <div className="mb-3 text-6xl">🎀</div>
              <p className="font-display text-xl font-semibold text-foreground/70">
                Em breve, novos produtos nesta categoria.
              </p>
              <p className="mt-2 text-sm text-foreground/55">
                Quer encomendar algo personalizado? Fala com a gente no WhatsApp.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {prods.products.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="aspect-square overflow-hidden bg-[var(--brand-salmon)]/15">
                    {p.image_url ? (
                      <img
                        src={optimizedImage(p.image_url, { width: 500, quality: 70 })}
                        srcSet={optimizedSrcSet(p.image_url, [300, 500, 700])}
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading={i < 4 ? "eager" : "lazy"}
                        fetchPriority={i < 4 ? "high" : "auto"}
                        decoding="async"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl">🎀</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display font-bold text-foreground">{p.name}</h3>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                        {p.description}
                      </p>
                    )}
                    {p.price !== null && p.price !== undefined && (
                      <div className="mt-3 font-display font-bold text-[var(--brand-pink)]">
                        R$ {Number(p.price).toFixed(2).replace(".", ",")}
                      </div>
                    )}
                    <SellerPickerButton
                      ariaLabel={`Pedir orçamento de ${p.name}`}
                      message={`Oiê! 🌸 Me apaixonei pelo produto "${p.name}" no site do Atelier Strelas e queria pedir um orçamento com você 💕`}
                      className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-brand-gradient px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
                    >
                      Pedir orçamento <ChevronRight className="h-4 w-4" />
                    </SellerPickerButton>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
