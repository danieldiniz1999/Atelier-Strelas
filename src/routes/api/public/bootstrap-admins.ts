// Rota pública para criar/garantir os dois usuários admin iniciais.
// Idempotente: só cria se não existirem. Usa supabaseAdmin (service role).
// Pode ser chamada quantas vezes quiser.
import { createFileRoute } from "@tanstack/react-router";

const USERS = [
  { username: "danieldiniz", password: "220416" },
  { username: "admin", password: "admin1234" },
];

export const Route = createFileRoute("/api/public/bootstrap-admins")({
  server: {
    handlers: {
      GET: async () => handle(),
      POST: async () => handle(),
    },
  },
});

async function handle() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const results: Array<{ username: string; status: string }> = [];

  for (const u of USERS) {
    const email = `${u.username}@strelas.local`;

    // Try to create the user
    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: u.password,
        email_confirm: true,
        user_metadata: { username: u.username },
      });

    let userId: string | null = null;

    if (createErr) {
      // Likely already exists — find by listing
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      const found = list?.users.find((x) => x.email === email);
      if (found) {
        userId = found.id;
        results.push({ username: u.username, status: "exists" });
      } else {
        results.push({ username: u.username, status: `error: ${createErr.message}` });
        continue;
      }
    } else if (created?.user) {
      userId = created.user.id;
      results.push({ username: u.username, status: "created" });
    }

    if (userId) {
      // Ensure admin role row exists
      const { error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: userId, role: "admin" },
          { onConflict: "user_id,role", ignoreDuplicates: true },
        );
      if (roleErr) {
        results[results.length - 1].status += ` (role error: ${roleErr.message})`;
      }
    }
  }

  return Response.json({ ok: true, results });
}
