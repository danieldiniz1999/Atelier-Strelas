import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin } from "lucide-react";
import logoAsset from "@/assets/logo-strelas.png.asset.json";
import seloAsset from "@/assets/selo-strelas.jpg.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[oklch(0.22_0.05_357)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <img src={logoAsset.url} alt="Atelier Strelas" className="h-14 w-auto brightness-0 invert" />
            <img src={seloAsset.url} alt="Selo Atelier Strelas Artes" className="h-16 w-16 rounded-full rotate-[6deg]" />
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
              contato@atelierstrelas.com.br
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
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--brand-bubblegum)]" />
              Atendemos todo o Brasil
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Atelier Strelas · Feito à mão, com linha, agulha e muito amor de mãe. Todos os direitos (e carinhos) reservados.</span>
          <Link to="/admin" className="hover:text-white/80">Acesso restrito</Link>
        </div>
      </div>
    </footer>
  );
}
