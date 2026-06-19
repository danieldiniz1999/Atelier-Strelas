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
    <header className="w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-3 px-4 sm:h-24 sm:px-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--brand-pink)]/30 bg-white text-[var(--brand-pink)] shadow-sm transition-colors hover:bg-[var(--brand-pink)] hover:text-white"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Atelier Strelas - Início"
        >
          <img
            src={logoAsset.url}
            alt="Atelier Strelas"
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--brand-pink)]/40 shadow-md shadow-[var(--brand-pink)]/20 transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16"
          />
        </Link>
      </div>

      {open && (
        <div className="border-t border-border bg-background shadow-lg">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `${l.to === "/" ? "" : l.to}${l.hash}` : l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-[var(--brand-pink)]"
              >
                {l.label}
              </a>
            ))}
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
        </div>
      )}
    </header>
  );
}
