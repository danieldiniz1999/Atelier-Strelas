import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Heart,
  Gift,
  Truck,
  Palette,
  Star,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  BadgeCheck,
  CreditCard,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CountUp } from "@/components/count-up";
import { TeamSection } from "@/components/team-section";
import { GallerySection } from "@/components/gallery-section";
import { SellerPickerButton } from "@/components/seller-picker";
import seloAsset from "@/assets/selo-strelas.jpg.asset.json";
import {
  listCategories,
  listFeaturedProducts,
} from "@/lib/products.functions";

const featuredQuery = queryOptions({
  queryKey: ["featured-products"],
  queryFn: () => listFeaturedProducts(),
});
const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier Strelas — Bolsas personalizadas para festas infantis" },
      {
        name: "description",
        content:
          "Bolsas, mochilas e necessaires personalizadas feitas à mão para festas infantis. Cada lembrancinha conta uma história — a do seu filho.",
      },
      { property: "og:title", content: "Atelier Strelas — Lembrancinhas que encantam" },
      {
        property: "og:description",
        content: "Bolsas personalizadas para festas infantis, feitas com amor.",
      },
      { property: "og:url", content: "https://atelier-strelas.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://atelier-strelas.lovable.app/" }],
  }),

  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(featuredQuery),
      context.queryClient.ensureQueryData(categoriesQuery),
    ]);
  },
  component: LandingPage,
});

const TESTIMONIALS = [
  { name: "Mariana Albuquerque", city: "Recife", state: "PE", text: "Foi amor à primeira vista! As bolsinhas da festa da minha Helena chegaram impecáveis e cada mãezinha pediu o contato. Capricho de outro mundo." },
  { name: "Camila Rezende", city: "Belo Horizonte", state: "MG", text: "A Strelas salvou a festa do Davi! Personalizou cada detalhe do tema super-heróis com um cuidado que não vi em lugar nenhum. Recomendo de olhos fechados." },
  { name: "Juliana Tavares", city: "Curitiba", state: "PR", text: "Atendimento impecável do início ao fim. Mandei a foto de inspiração e recebi algo ainda mais lindo do que imaginei. Minha filha não desgruda da bolsinha!" },
  { name: "Fernanda Lopes", city: "Salvador", state: "BA", text: "Já é a terceira festa que encomendo com a Strelas. Qualidade, prazo e bom gosto são marca registrada. Virou meu xodó na hora de planejar lembrancinhas." },
  { name: "Patrícia Moreira", city: "Porto Alegre", state: "RS", text: "Cada bolsinha é uma obra de arte! As mães comentaram a festa toda. Vale cada centavo — é daquelas lembranças que ficam guardadas pra sempre." },
  { name: "Renata Sales", city: "Fortaleza", state: "CE", text: "Profissionalismo do começo ao fim. A dona é super atenciosa, tira todas as dúvidas e entrega antes do prazo. Minhas amigas estão todas pedindo o link!" },
];

const FAQ = [
  {
    q: "Vocês atendem em todo o Brasil?",
    a: "Sim! Enviamos as encomendas para todo o território nacional via correios e transportadoras. O frete é calculado pelo CEP e combinado antes da confirmação do pedido.",
  },
  {
    q: "Qual o prazo médio de produção?",
    a: "Trabalhamos com produção sob encomenda. O prazo médio é de 15 a 25 dias úteis, dependendo da quantidade e da complexidade do tema. Para datas próximas, fale conosco no WhatsApp para verificar disponibilidade.",
  },
  {
    q: "Posso pedir um tema personalizado que não está no catálogo?",
    a: "Com certeza! Adoramos novos desafios. Mande sua ideia ou foto de inspiração no WhatsApp e nós criamos algo único para a festa da sua criança.",
  },
  {
    q: "Qual a quantidade mínima de bolsas por pedido?",
    a: "Trabalhamos com pedidos a partir de 10 unidades. Para quantidades maiores, oferecemos condições especiais — consulte!",
  },
  {
    q: "Como funciona a personalização com o nome do aniversariante?",
    a: "Cada pedido você pode personalizar colocando nome, idade, data ou uma frase escolhida por você, aplicada no tecido. Tudo é aprovado antes da produção iniciar.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos PIX, transferência bancária e parcelamento no cartão via link de pagamento. O pedido é confirmado após o sinal de 50%.",
  },
];

function LandingPage() {
  const { data: featured } = useSuspenseQuery(featuredQuery);
  const { data: categories } = useSuspenseQuery(categoriesQuery);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <WhatsappFloat />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[var(--brand-bubblegum)] opacity-30 blur-3xl" />
          <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-[var(--brand-orange)] opacity-25 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-[var(--brand-salmon)] opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
          <div className="md:col-start-1 md:row-start-1">
            <span className="hero-rise inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand-pink)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Lembrancinhas únicas
            </span>
            <h1 className="hero-rise hero-rise-delay-1 mt-5 font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              A festa do seu filho merece uma{" "}
              <span className="text-brand-gradient">lembrança inesquecível</span>.
            </h1>
            <p className="hero-rise hero-rise-delay-2 mt-5 max-w-lg text-lg text-foreground/75">
              Bolsas, mochilas e necessaires personalizadas, feitas à mão com o
              tema dos sonhos da sua criança. Cada peça nasce do carinho — e vira
              memória que dura pra vida toda.
            </p>
          </div>

          <div className="hero-rise hero-rise-delay-2 relative order-2 md:order-none md:col-start-2 md:row-span-2 md:row-start-1 md:-mt-64 lg:-mt-80">
            <div className="relative aspect-square w-full max-w-xs mx-auto">
              <div className="absolute inset-0 rotate-3 rounded-[2rem] bg-brand-gradient shadow-2xl" />
              <div className="absolute inset-0 -rotate-2 overflow-hidden rounded-[2rem] bg-white shadow-xl">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-salmon)]/40 via-[var(--brand-bubblegum)]/30 to-[var(--brand-orange)]/40">
                  <div className="text-center">
                    <div className="text-[6rem] leading-none">🎀</div>
                    <p className="mt-1 font-display text-base font-bold text-[var(--brand-pink)]">
                      Atelier Strelas
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 rotate-6 rounded-2xl bg-white px-4 py-2 shadow-lg">
                <div className="text-[10px] font-semibold text-foreground/60">Tema</div>
                <div className="font-display text-sm font-bold text-[var(--brand-pink)]">Princesa Ana 🌸</div>
              </div>
            </div>
          </div>

          <div className="order-3 md:order-none md:col-start-1 md:row-start-2">
            <div className="hero-rise hero-rise-delay-3 flex flex-wrap gap-3">
              <SellerPickerButton
                ariaLabel="Pedir orçamento no WhatsApp"
                message="Vim pelo site e quero um orçamento para a festa da minha criança! 🎀"
                className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-[var(--brand-pink)]/30 transition-transform hover:scale-105"
              >
                Pedir orçamento <MessageCircle className="h-4 w-4" />
              </SellerPickerButton>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-pink)] bg-white px-7 py-3.5 text-base font-bold text-[var(--brand-pink)] transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
              >
                Ver catálogo <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="#sobre"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-salmon)] bg-white px-7 py-3.5 text-base font-bold text-foreground/75 transition-colors hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)]"
              >
                Conheça a Strelas
              </a>
            </div>

            <div className="hero-rise hero-rise-delay-3 mt-10 flex flex-wrap items-center gap-6 text-sm text-foreground/70">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[var(--brand-bubblegum)]" />
                Feito à mão com amor
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[var(--brand-orange)]" />
                Entrega em todo o Brasil
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[var(--brand-pink)]" />
                +1500 festas encantadas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NÚMEROS MARCANTES */}
      <section className="relative bg-brand-gradient py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { end: 1500, prefix: "+", label: "Festas encantadas" },
                { end: 20000, prefix: "+", label: "Bolsas personalizadas feitas à mão" },
                { end: 11, label: "Anos de atelier" },
                { end: 100, suffix: "%", label: "Mães que indicam" },
              ].map((s) => (
                <div key={s.label} className="flex h-full flex-col items-center justify-center">
                  <CountUp
                    end={s.end}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="font-display text-4xl font-extrabold leading-none sm:text-5xl"
                  />
                  <span className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GallerySection />



      {/* SOBRE */}
      <section id="sobre" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
                <Sparkles className="h-4 w-4" /> Nossa história <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Bolsinhas que nasceram do <span className="text-brand-gradient">amor de mãe</span>
              </h2>
              <div className="mt-5 space-y-4 text-foreground/75">
                <p>
                  A Atelier Strelas nasceu em uma cozinha pequena, em meio a tecidos
                  espalhados e a vontade de criar algo único para a festa de uma
                  filha. O que começou como um presente virou paixão — e a paixão
                  virou propósito.
                </p>
                <p>
                  Hoje, cada bolsa que sai daqui carrega o mesmo carinho daquele
                  primeiro pedido. A gente acredita que lembrancinha não é
                  obrigação: é o detalhe que faz a mãe respirar aliviada quando
                  todos os convidados vão embora sorrindo, com algo lindo na mão.
                </p>
                <p>
                  Mais de 1500 festas já passaram pelo nosso atelier. E cada uma
                  delas é tratada como se fosse a primeira — porque para aquela
                  família, ela é única.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Heart, title: "Feito à mão", text: "Cada peça é única, sem produção em série." },
                { icon: Palette, title: "Personalizado", text: "Tema, cores e nome a seu gosto." },
                { icon: Gift, title: "Embalagem caprichada", text: "Pronto para entregar e encantar." },
                { icon: Star, title: "Qualidade premium", text: "Tecidos selecionados, costura impecável." },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border-2 border-[var(--brand-salmon)]/30 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg hover:shadow-[var(--brand-pink)]/20 active:scale-95 sm:flex-col sm:items-stretch sm:gap-0 sm:p-5"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:mb-3">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-foreground">{f.title}</h3>
                    <p className="mt-1 text-sm text-foreground/65">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* NOSSA EQUIPE */}
      <TeamSection />

      {/* CATEGORIAS */}
      <section className="bg-[var(--brand-salmon)]/15 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
                <Sparkles className="h-4 w-4" /> O que criamos <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Para cada festa, uma <span className="text-brand-gradient">história única</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 60}>
                <Link
                  to="/catalogo"
                  search={{ categoria: cat.slug }}
                  className="group block h-full rounded-2xl border-2 border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-bubblegum)] hover:shadow-lg active:scale-95 active:border-[var(--brand-pink)] active:shadow-lg active:shadow-[var(--brand-pink)]/30"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-2xl">
                    🎁
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-2 text-sm text-foreground/65">{cat.description}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-pink)] group-hover:gap-2 transition-all">
                    Ver modelos <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
                <Sparkles className="h-4 w-4" /> Mais queridinhos <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Destaques do <span className="text-brand-gradient">atelier</span>
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1 rounded-full border-2 border-[var(--brand-pink)] px-5 py-2 text-sm font-bold text-[var(--brand-pink)] transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
            >
              Ver catálogo completo <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        {featured.products.length === 0 ? (
          <ScrollReveal>
            <div className="rounded-2xl border-2 border-dashed border-[var(--brand-salmon)]/40 bg-white p-12 text-center">
              <div className="mb-3 text-5xl">🎀</div>
              <p className="font-display text-lg font-semibold text-foreground/70">
                Em breve, novos produtos!
              </p>
              <p className="mt-1 text-sm text-foreground/55">
                Em breve nossas estrelinhas estarão aqui — fale conosco para encomendar.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="mx-auto grid max-w-4xl gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {featured.products.slice(0, 6).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="bg-[var(--brand-bubblegum)]/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
                <Sparkles className="h-4 w-4" /> Mamães felizes <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Quem vive a Strelas, <span className="text-brand-gradient">conta pra todo mundo</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm">
                  <div className="mb-3 flex gap-0.5 text-[var(--brand-orange)]">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-foreground/75">
                    “{t.text}”
                  </p>
                  <div className="mt-4 border-t border-border pt-3">
                    <div className="font-display font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-foreground/55">
                      {t.city} — {t.state}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPRA SEGURA / GARANTIAS */}
      <section className="relative border-y border-[var(--brand-salmon)]/30 bg-white py-14">
        <img
          src={seloAsset.url}
          alt="Selo oficial Atelier Strelas Artes"
          className="pointer-events-none absolute right-4 top-6 h-20 w-20 rotate-[8deg] opacity-90 sm:right-8 sm:top-8 sm:h-28 sm:w-28 md:right-12 md:h-32 md:w-32"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-bubblegum)]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--brand-pink)]">
                <ShieldCheck className="h-3.5 w-3.5" /> Compra com confiança
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Sua festa nas mãos de quem <span className="text-brand-gradient">se importa</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-foreground/65">
                A gente sabe o quanto cada detalhe importa. Por isso, do primeiro
                contato até a entrega, você tem garantia de carinho em cada etapa.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BadgeCheck,
                title: "Aprovação antes da produção",
                text: "Você confirma a arte, cores das bolsas e quantidade para meninos e meninas antes da produção das bolsinhas. Só iniciamos quando estiver tudo do seu jeito.",
              },
              {
                icon: ShieldCheck,
                title: "Garantia de qualidade",
                text: "Todo pedido é confirmado antes da produção, com a sua participação verificando a arte nos detalhes, concerteza confeccionaremos o pedido com perfeição 😍.",
              },
              {
                icon: CreditCard,
                title: "Pagamento facilitado",
                text: "PIX, transferência ou cartão parcelado em link seguro. Sinal de 50% para começar.",
              },
              {
                icon: MessageCircle,
                title: "Atendimento direto",
                text: "Você fala direto com a design que confeccionará sua arte de acordo com sua imaginação.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group flex flex-col rounded-2xl border-2 border-[var(--brand-salmon)]/25 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg hover:shadow-[var(--brand-pink)]/20 active:scale-95"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/65">{item.text}</p>
              </div>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-foreground/65">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--brand-pink)]" /> Site com conexão segura (SSL)
              </span>
              <span className="text-foreground/20">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[var(--brand-pink)]" /> Envio rastreado para todo o Brasil
              </span>
              <span className="text-foreground/20">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-[var(--brand-pink)]" /> +1500 mães satisfeitas
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
              <Sparkles className="h-4 w-4" /> Tira-dúvidas <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Perguntas <span className="text-brand-gradient">frequentes</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border-2 border-[var(--brand-salmon)]/30 bg-white px-5"
              >
                <AccordionTrigger className="text-left font-display font-bold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 pb-20 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-gradient px-8 py-14 text-center text-white shadow-2xl sm:px-12">
            <Sparkles className="mx-auto h-10 w-10" />
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
              Pronta para encantar a festa da sua criança?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Chama a gente no WhatsApp, manda sua ideia ou inspiração — a gente
              transforma em algo único.
            </p>
            <SellerPickerButton
              ariaLabel="Pedir orçamento no WhatsApp"
              message="Vim pelo site e quero um orçamento para a festa da minha criança! 🎀"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-[var(--brand-pink)] shadow-lg transition-transform hover:scale-105"
            >
              Quero meu orçamento
              <ChevronRight className="h-4 w-4" />
            </SellerPickerButton>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
  };
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-[var(--brand-salmon)]/15">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🎀</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <h3 className="font-display text-xs font-bold leading-tight text-foreground line-clamp-2">{product.name}</h3>
        {product.price !== null && product.price !== undefined && (
          <div className="mt-1.5 font-display text-sm font-bold text-[var(--brand-pink)]">
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </div>
        )}
      </div>
    </div>
  );
}
