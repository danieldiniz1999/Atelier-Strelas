import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Instagram } from "lucide-react";
import logoAsset from "@/assets/logo-strelas.png.asset.json";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    <header className="w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4 sm:h-24 sm:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-pink)]/30 bg-white text-[var(--brand-pink)] shadow-sm transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
            <SheetHeader className="border-b border-border/60 p-6">
              <SheetTitle className="flex items-center gap-3">
                <img
                  src={logoAsset.url}
                  alt="Atelier Strelas"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--brand-pink)]/40"
                />
                <span className="text-base font-bold text-foreground">Atelier Strelas</span>
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
                      "rounded-lg px-4 py-3 text-base font-semibold transition-colors",
                      active
                        ? "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]"
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
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-3 text-base font-bold text-white shadow-sm"
              >
                <Instagram className="h-4 w-4" /> @atelierstrelass
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2" aria-label="Atelier Strelas - Início">
          <img
            src={logoAsset.url}
            alt="Atelier Strelas"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--brand-pink)]/40 shadow-md shadow-[var(--brand-pink)]/20 transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16"
          />
        </Link>
      </div>
    </header>
  );
}
