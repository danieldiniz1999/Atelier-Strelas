// Botão flutuante de WhatsApp com ícone oficial (SVG).
// O número está como placeholder — basta atualizar a constante quando receber.
const WHATSAPP_NUMBER = ""; // ex: "5511999999999"
const WHATSAPP_MESSAGE = "Olá! Vim pelo site e gostaria de saber mais sobre as bolsas personalizadas.";

export function WhatsappFloat() {
  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a Strelas no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 wpp-pulse sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      {/* Ícone oficial do WhatsApp */}
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 sm:h-9 sm:w-9"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.792 1.23 1.82 2.434 3.41 4.46 4.318.616.287 2.005.888 2.692.888.817 0 2.063-.515 2.434-1.318.13-.288.244-.602.244-.93 0-.66-.71-.95-1.546-1.295zm-3.224 8.42c-1.99 0-3.91-.45-5.673-1.31l-3.95 1.27 1.276-3.93a13.07 13.07 0 0 1-1.435-5.96c0-7.16 5.834-12.96 13.012-12.96 7.18 0 13.012 5.8 13.012 12.96.001 7.157-5.83 12.957-13.012 12.957zm0-26.945C7.926-1.32 1.323 5.245 1.323 13.32c0 2.665.73 5.273 2.117 7.534L1 28.683l8.057-2.62a14.7 14.7 0 0 0 6.83 1.706c7.927 0 14.532-6.563 14.534-14.636C30.42 5.038 23.81-1.32 15.886-1.32z"/>
      </svg>
    </a>
  );
}
