import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/logo-strelas.png.asset.json";
import seloAsset from "@/assets/selo-strelas.jpg.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[oklch(0.22_0.05_357)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <img
              src={logoAsset.url}
              alt="Atelier Strelas"
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-full bg-white object-cover p-1 shadow-md ring-2 ring-white/15"
            />
            <img
              src={seloAsset.url}
              alt="Selo Atelier Strelas Artes"
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-white/15"
            />
          </div>
          <p className="mt-4 text-sm text-white/75">
            Bolsas e mochilas personalizadas que transformam cada festa infantil em
            uma lembrança inesquecível.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-white">Navegue</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link to="/" className="hover:text-[var(--brand-bubblegum)]">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-[var(--brand-bubblegum)]">Catálogo completo</Link></li>
            <li><a href="/#sobre" className="hover:text-[var(--brand-bubblegum)]">Sobre a Strelas</a></li>
            <li><a href="/#faq" className="hover:text-[var(--brand-bubblegum)]">Dúvidas frequentes</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-white">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--brand-bubblegum)]" />
              sitestrelas@gmail.com
            </li>
            <li>
              <a
                href="https://www.instagram.com/atelierstrelass"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--brand-bubblegum)]"
              >
                <Instagram className="h-4 w-4 text-[var(--brand-bubblegum)]" />
                @atelierstrelass
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5585987773944?text=Ol%C3%A1%21%20Vim%20pelo%20site%20do%20Atelier%20Strelas%20e%20gostaria%20de%20um%20atendimento%20%F0%9F%92%95"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--brand-bubblegum)]"
              >
                <MessageCircle className="h-4 w-4 text-[var(--brand-bubblegum)]" />
                Atendimento ao cliente
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Atelier Strelas · Feito à mão, com linha, agulha e muito amor de mãe. Todos os direitos reservados.</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Desenvolvido por</span>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 shadow-sm">
                <img
                  src="/nissi-digital-logo.png"
                  alt="Agência Nissi Digital"
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>
            <span className="text-white/20">|</span>
            <Link to="/admin" className="hover:text-white/80">Acesso restrito</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
