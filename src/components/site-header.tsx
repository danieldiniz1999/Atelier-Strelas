import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Instagram } from "lucide-react";
import logoAsset from "@/assets/logo-strelas.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Início", to: "/" },
    { label: "Sobre", to: "/", hash: "#sobre" },
    { label: "Catálogo", to: "/catalogo" },
    { label: "Depoimentos", to: "/", hash: "#depoimentos" },
    { label: "FAQ", to: "/", hash: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold" aria-label="Atelier Strelas - Início">
          <img src={logoAsset.url} alt="Atelier Strelas" className="h-12 w-auto md:h-14" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `${l.to === "/" ? "" : l.to}${l.hash}` : l.to}
              className="text-sm font-semibold text-foreground/80 transition-colors hover:text-[var(--brand-pink)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/atelierstrelass"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram do Atelier Strelas"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white shadow-sm transition-transform hover:scale-110"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `${l.to === "/" ? "" : l.to}${l.hash}` : l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-semibold text-foreground/80 hover:bg-secondary hover:text-[var(--brand-pink)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
