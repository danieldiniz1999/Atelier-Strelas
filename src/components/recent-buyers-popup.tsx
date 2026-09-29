import { useEffect, useState } from "react";
import { ShoppingBag, X, BadgeCheck } from "lucide-react";

type Buyer = {
  name: string;
  city: string;
  state: string;
  product: string;
};


const BUYERS: Buyer[] = [
  { name: "Juliana M.", city: "São Paulo", state: "SP", product: "Kit 20 bolsinhas tema Safári" },
  { name: "Camila R.", city: "Rio de Janeiro", state: "RJ", product: "Kit 15 mochilas tema Princesas" },
  { name: "Fernanda L.", city: "Salvador", state: "BA", product: "Kit 25 bolsinhas tema Circo" },
  { name: "Patrícia M.", city: "Porto Alegre", state: "RS", product: "Kit 10 necessaires tema Floresta" },
  { name: "Renata S.", city: "Fortaleza", state: "CE", product: "Kit 30 bolsinhas tema Dinossauros" },
  { name: "Aline C.", city: "Belo Horizonte", state: "MG", product: "Kit 20 mochilas tema Astronauta" },
  { name: "Beatriz F.", city: "Curitiba", state: "PR", product: "Kit 18 bolsinhas tema Fadas" },
  { name: "Larissa T.", city: "Recife", state: "PE", product: "Kit 22 bolsinhas tema Unicórnio" },
  { name: "Mariana O.", city: "Brasília", state: "DF", product: "Kit 15 mochilas tema Fazendinha" },
  { name: "Débora A.", city: "Florianópolis", state: "SC", product: "Kit 12 necessaires tema Sereia" },
  { name: "Vanessa P.", city: "Goiânia", state: "GO", product: "Kit 20 bolsinhas tema Piratas" },
  { name: "Tatiane B.", city: "Manaus", state: "AM", product: "Kit 16 mochilas tema Jardim" },
];

export function RecentBuyersPopup() {
  const [index, setIndex] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    let cancelled = false;
    const showNext = () => {
      if (cancelled) return;
      setIndex((i) => (i + 1) % BUYERS.length);
      setMinutes(1 + Math.floor(Math.random() * 7));
      setVisible(true);
      // hide after 6s, then next after 4s
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 6000);
      window.setTimeout(() => {
        if (!cancelled) showNext();
      }, 10000);
    };
    // first show after 4s
    const t = window.setTimeout(showNext, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [closed]);

  if (closed) return null;
  const buyer = BUYERS[index];

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-40 w-auto max-w-[220px] sm:bottom-6 sm:left-6 sm:max-w-xs transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="relative flex items-center gap-2 rounded-2xl border border-black/5 bg-white/95 backdrop-blur-sm p-2 pr-6 sm:p-2.5 sm:pr-7 shadow-lg shadow-black/10">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]">
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-foreground leading-tight">
            <span className="truncate">{buyer.name}</span>
            <span className="text-muted-foreground font-normal truncate">· {buyer.state}</span>
          </p>
          <p className="mt-0.5 line-clamp-1 text-[9px] sm:text-[11px] text-muted-foreground leading-tight">
            comprou <span className="font-medium text-foreground">{buyer.product}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[8px] sm:text-[10px] text-muted-foreground">
            <BadgeCheck className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
            <span className="truncate">há {minutes} min · verificada</span>
          </p>
        </div>
        <button
          type="button"
          aria-label="Fechar aviso"
          onClick={() => setClosed(true)}
          className="absolute right-1 top-1 sm:right-1.5 sm:top-1.5 rounded-full p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground"
        >
          <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </div>
    </div>
  );
}
