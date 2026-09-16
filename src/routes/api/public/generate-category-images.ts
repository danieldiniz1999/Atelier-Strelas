// Endpoint desativado por segurança para impedir sobrescrita não-autorizada de fotos e consumo indevido de API
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/generate-category-images")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { error: "Acesso negado: Este endpoint foi desativado por motivos de segurança." },
          { status: 403 },
        );
      },
      GET: async () => {
        return Response.json(
          { error: "Acesso negado." },
          { status: 403 },
        );
      },
    },
  },
});
