import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Camada de escrita do Painel Administrativo.
// Roda com service role para contornar o RLS (que restringe create/update/delete
// a role "admin") e valida o acesso pelo e-mail cadastrado em Setting
// (admin_email / admin_email_2 / admin_email_3) ou pela role "admin" do sistema.
// Assim, qualquer conta autorizada pelo AdminGuard consegue salvar — mesmo com
// role "user" — pois a checagem de permissão acontece aqui no servidor.

const ADMIN_KEYS = ["admin_email", "admin_email_2", "admin_email_3"];
const ALLOWED = ["News", "Notice", "CalendarEvent", "Testimonial", "Student", "Teacher", "Menu", "ContactInfo", "Ticker", "Setting"];

async function isAdmin(base44, svc) {
  let user;
  try {
    user = await base44.auth.me();
  } catch {
    return false;
  }
  const email = (user?.email || "").toLowerCase().trim();
  const role = user?.role;
  if (role === "admin") return true;
  const rows = await svc.entities.Setting.list();
  const emails = rows
    .filter((r) => ADMIN_KEYS.includes(r.key))
    .map((r) => (r.value || "").toLowerCase().trim())
    .filter(Boolean);
  return emails.length > 0 && emails.includes(email);
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const svc = base44.asServiceRole;
    const body = await req.json();
    const { action, entity } = body;

    // Booleano seguro: o chamador só descobre se ELE é admin, sem expor a lista
    // de e-mails administradores. Usado pelo AdminGuard para decidir o acesso.
    if (action === "amIAdmin") {
      return Response.json({ isAdmin: await isAdmin(base44, svc) });
    }

    // A partir daqui, toda ação exige que o chamador seja administrador.
    if (!(await isAdmin(base44, svc))) {
      return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
    }

    // Lista de e-mails administradores — só retornada a quem já é administrador,
    // para alimentar o gerenciador de acesso dentro do painel.
    if (action === "adminEmails") {
      const rows = await svc.entities.Setting.list();
      const out = rows
        .filter((r) => ADMIN_KEYS.includes(r.key))
        .map((r) => ({ id: r.id, key: r.key, value: r.value || "" }));
      return Response.json({ rows: out });
    }

    if (!ALLOWED.includes(entity)) {
      return Response.json({ error: "Entidade não permitida." }, { status: 400 });
    }
    const coll = svc.entities[entity];

    if (action === "list") {
      let rows;
      if (body.filter && Object.keys(body.filter).length) {
        rows = await coll.filter(body.filter, body.sort, body.limit);
      } else {
        rows = await coll.list(body.sort, body.limit);
      }
      return Response.json({ rows });
    }
    if (action === "create") {
      const rec = await coll.create(body.data);
      return Response.json({ record: rec });
    }
    if (action === "update") {
      const rec = await coll.update(body.id, body.data);
      return Response.json({ record: rec });
    }
    if (action === "delete") {
      await coll.delete(body.id);
      return Response.json({ ok: true });
    }
    if (action === "bulkCreate") {
      const recs = await coll.bulkCreate(body.records);
      return Response.json({ records: recs });
    }

    return Response.json({ error: "Ação inválida." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}