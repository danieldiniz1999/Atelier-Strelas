// Rota administrativa protegida por segredo para provisionamento inicial
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/bootstrap-admins")({
  server: {
    handlers: {
      GET: async () => Response.json({ error: "Acesso negado." }, { status: 403 }),
      POST: async ({ request }) => {
        const secretHeader = request.headers.get("x-bootstrap-secret");
        const expectedSecret = process.env.BOOTSTRAP_ADMIN_SECRET;

        if (!expectedSecret || secretHeader !== expectedSecret) {
          return Response.json(
            { error: "Acesso negado: Requer x-bootstrap-secret válido." },
            { status: 403 },
          );
        }

        return handle();
      },
    },
  },
});

async function handle() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const results: Array<{ username: string; status: string }> = [];

  const usersToBootstrap = [
    {
      username: "danieldiniz",
      password: process.env.DANIEL_INITIAL_PASSWORD,
    },
    {
      username: "admin",
      password: process.env.ADMIN_INITIAL_PASSWORD,
    },
  ].filter((u) => Boolean(u.password));

  if (usersToBootstrap.length === 0) {
    return Response.json({
      ok: false,
      message: "Nenhuma senha de bootstrap configurada em DANIEL_INITIAL_PASSWORD ou ADMIN_INITIAL_PASSWORD.",
    }, { status: 400 });
  }

  for (const u of usersToBootstrap) {
    const email = `${u.username}@strelas.local`;

    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: u.password!,
        email_confirm: true,
        user_metadata: { username: u.username },
      });

    let userId: string | null = null;

    if (createErr) {
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
