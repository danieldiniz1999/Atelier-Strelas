import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import g1 from "@/assets/galeria-01.jpeg.asset.json";
import g2 from "@/assets/galeria-02.jpeg.asset.json";
import g3 from "@/assets/galeria-03.jpeg.asset.json";
import g4 from "@/assets/galeria-04.jpeg.asset.json";
import g5 from "@/assets/galeria-05.jpeg.asset.json";
import g6 from "@/assets/galeria-06.jpeg.asset.json";

const PHOTOS: { url: string; caption: string }[] = [
  { url: g6.url, caption: "Era uma vez… Princesas Disney" },
  { url: g1.url, caption: "Festa Toy Story do Enrico, Benjamim e Mateo" },
  { url: g2.url, caption: "Aniversário do Gael em tons pastel" },
  { url: g4.url, caption: "Alice no País das Maravilhas" },
  { url: g3.url, caption: "Manuela e a bolsinha de unicórnio" },
  { url: g5.url, caption: "Festa do Joaquim, 1 aninho" },
];

export function GallerySection() {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  return (
    <section id="galeria" className="bg-[var(--brand-cream)]/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[var(--brand-pink)]/25">
              <Sparkles className="h-4 w-4" /> Festas reais <Sparkles className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Trabalhos que <span className="text-brand-gradient">marcaram histórias</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/65">
              Cada festa é única — aqui vão alguns momentos especiais que tivemos
              o carinho de fazer parte.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="mx-auto w-full"
          >
            <CarouselContent className="-ml-3">
              {PHOTOS.map((p, i) => (
                <CarouselItem
                  key={i}
                  className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <figure className="group overflow-hidden rounded-2xl border border-[var(--brand-salmon)]/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-pink)] hover:shadow-lg hover:shadow-[var(--brand-pink)]/15">
                    <div className="aspect-[4/5] overflow-hidden bg-[var(--brand-cream)]/50">
                      <img
                        src={p.url}
                        alt={p.caption}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
