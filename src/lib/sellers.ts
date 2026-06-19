// Dados das vendedoras do Atelier Strelas.
// Os números são no formato internacional (55 + DDD + número) para o link do WhatsApp.

export type Seller = {
  id: string;
  name: string;
  phone: string; // formato wa.me, só dígitos
  initials: string;
  displayPhone: string;
};

export const SELLERS: Seller[] = [
  {
    id: "dani",
    name: "Dani",
    phone: "5585987752593",
    displayPhone: "(85) 98775-2593",
    initials: "D",
  },
  {
    id: "bia",
    name: "Bia",
    phone: "5585921440297",
    displayPhone: "(85) 92144-0297",
    initials: "B",
  },
];

export const DEFAULT_WPP_MESSAGE =
  "Olá! Vim pelo site do Atelier Strelas e gostaria de saber mais sobre as bolsas personalizadas. 💕";

export function buildWhatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
