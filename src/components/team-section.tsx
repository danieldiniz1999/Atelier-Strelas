import { Sparkles, Heart } from "lucide-react";
import { SELLERS, buildWhatsappLink, DEFAULT_WPP_MESSAGE } from "@/lib/sellers";
import { ScrollReveal } from "@/components/scroll-reveal";

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function TeamSection() {
  return (
    <section id="equipe" className="bg-[var(--brand-salmon)]/10 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
              <Sparkles className="h-4 w-4" /> Nossa equipe <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Quem faz a <span className="text-brand-gradient">magia acontecer</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/65">
              Somos uma dupla apaixonada por transformar festas em lembranças que
              ficam para sempre. Pode chamar qualquer uma de nós — o carinho é o mesmo.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          {SELLERS.map((s, i) => (
            <ScrollReveal key={s.id} delay={i * 120}>
              <div className="group flex h-full flex-col items-center rounded-3xl border-2 border-[var(--brand-salmon)]/30 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-xl hover:shadow-[var(--brand-pink)]/15">
                <div className="relative">
                  <div className="absolute inset-0 -m-1 rounded-full bg-brand-gradient opacity-70 blur-md transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-brand-gradient font-display text-5xl font-extrabold text-white shadow-lg ring-4 ring-white">
                    {s.photoUrl ? (
                      <img src={s.photoUrl} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      s.initials
                    )}
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl font-extrabold text-foreground">
                  {s.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-pink)]">
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  Atendimento &amp; criação
                </span>

                <p className="mt-3 text-sm text-foreground/65">
                  {s.id === "dani"
                    ? 'Cuida do seu pedido do primeiro "oi" até a bolsinha chegar na sua porta.'
                    : "Capricha em cada detalhe pra que a sua festa fique do jeitinho que você sonhou."}
                </p>

                <a
                  href={buildWhatsappLink(
                    s.phone,
                    `Olá ${s.name}! ${DEFAULT_WPP_MESSAGE}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Chamar {s.name}
                </a>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
