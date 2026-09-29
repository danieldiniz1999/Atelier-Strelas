import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Instagram, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/logo-strelas.png.asset.json";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SellerPickerButton } from "@/components/seller-picker";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { label: "Início", to: "/" },
    { label: "Sobre", to: "/", hash: "#sobre" },
    { label: "Catálogo", to: "/catalogo" },
    { label: "Depoimentos", to: "/", hash: "#depoimentos" },
    { label: "FAQ", to: "/", hash: "#faq" },
  ];

  const isActive = (l: (typeof links)[number]) => {
    if (l.hash) return pathname === l.to && typeof window !== "undefined" && window.location.hash === l.hash;
    return pathname === l.to;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* LOGO & BRAND */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* HAMBURGER (MOBILE ONLY) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-pink)]/30 bg-white text-[var(--brand-pink)] shadow-sm transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[82vw] max-w-xs p-0">
              <SheetHeader className="border-b border-border/60 p-5">
                <SheetTitle className="flex items-center gap-3">
                  <img
                    src={logoAsset.url}
                    alt="Atelier Strelas"
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--brand-pink)]/40"
                  />
                  <div className="text-left">
                    <span className="block text-base font-bold text-foreground">Atelier Strelas</span>
                    <span className="block text-xs font-normal text-foreground/60">Lembrancinhas que encantam</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 py-4">
                {links.map((l) => {
                  const href = l.hash ? `${l.to === "/" ? "" : l.to}${l.hash}` : l.to;
                  const active = isActive(l);
                  return (
                    <a
                      key={l.label}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] font-bold"
                          : "text-foreground/80 hover:bg-secondary hover:text-[var(--brand-pink)]",
                      )}
                    >
                      {l.label}
                    </a>
                  );
                })}
                <a
                  href="https://www.instagram.com/atelierstrelass"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  <Instagram className="h-4 w-4" /> @atelierstrelass
                </a>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2.5" aria-label="Atelier Strelas - Início">
            <img
              src={logoAsset.url}
              alt="Atelier Strelas"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[var(--brand-pink)]/40 shadow-sm transition-transform duration-300 hover:scale-105 sm:h-13 sm:w-13"
            />
            <div className="hidden sm:block">
              <span className="font-display text-base font-extrabold text-foreground tracking-tight sm:text-lg">
                Atelier Strelas
              </span>
              <span className="block text-[10px] font-semibold text-[var(--brand-pink)] uppercase tracking-wider">
                Lembrancinhas Personalizadas
              </span>
            </div>
          </Link>
        </div>

        {/* DESKTOP & TABLET NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {links.map((l) => {
            const href = l.hash ? `${l.to === "/" ? "" : l.to}${l.hash}` : l.to;
            const active = isActive(l);
            return (
              <a
                key={l.label}
                href={href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] font-bold"
                    : "text-foreground/75 hover:bg-[var(--brand-salmon)]/15 hover:text-[var(--brand-pink)]",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* DESKTOP & MOBILE CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://www.instagram.com/atelierstrelass"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Atelier Strelas"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 hover:text-[var(--brand-pink)] hover:border-[var(--brand-pink)]/40 transition-colors"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <SellerPickerButton
            ariaLabel="Pedir orçamento no WhatsApp"
            message="Vim pelo site e quero um orçamento para a festa da minha criança! 🎀"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-[var(--brand-pink)]/25 transition-transform hover:scale-105"
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Orçamento</span>
          </SellerPickerButton>
        </div>
      </div>
    </header>
  );
}
