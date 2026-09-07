import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { sha256, signToken, verifyToken, TOKEN_TTL_MS } from "../../shared/session-tokens.ts";

// Camada de autenticação e escrita do Painel Administrativo.
// O acesso é por conta própria (e-mail + senha, igual ao Portal Escolar):
// o login valida o hash da senha no AdminAccount e emite um token de sessão
// assinado (HMAC-SHA256) com { sub, role: "admin", exp }. Todas as demais
// ações aceitam esse token — ou, na transição, uma conta admin da plataforma.
// Roda com service role para contornar o RLS admin-only das entidades.

const ADMIN_KEYS = ["admin_email", "admin_email_2", "admin_email_3", "admin_email_4", "admin_email_5"];
const ALLOWED = ["News", "Notice", "CalendarEvent", "Testimonial", "Student", "Teacher", "Menu", "ContactInfo", "Ticker", "Setting", "GalleryImage", "AdminAccount"];

function normEmail(e) {
  return (e || "").trim().toLowerCase();
}

// Nunca expõe password_hash.
function sanitizeAdmin(a) {
  if (!a) return null;
  return {
    id: a.id,
    email: a.email,
    is_active: a.is_active,
    password_changed: a.password_changed,
  };
}

const NO_SECRET = () =>
  Response.json({ error: "Servidor sem segredo de sessão configurado (PORTAL_TOKEN_SECRET)." }, { status: 500 });

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const svc = base44.asServiceRole;
    const body = await req.json();
    const { action, entity } = body;

    const SECRET = process.env.PORTAL_TOKEN_SECRET;

    // ---------- Sessão do administrador (e-mail + senha) ----------
    if (action === "adminLogin") {
      if (!SECRET) return NO_SECRET();
      const hash = await sha256(body.password);
      const rows = await svc.entities.AdminAccount.filter({
        email: normEmail(body.email),
        is_active: true,
      });
      const acc = rows[0];
      if (!acc || acc.password_hash !== hash) {
        return Response.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
      }
      const token = await signToken(
        { sub: acc.id, role: "admin", exp: Date.now() + TOKEN_TTL_MS },
        SECRET
      );
      return Response.json({ admin: { ...sanitizeAdmin(acc), token } });
    }

    if (action === "adminMe") {
      if (!SECRET) return NO_SECRET();
      const payload = await verifyToken(body.token, SECRET);
      if (!payload || payload.role !== "admin") {
        return Response.json({ error: "Sessão inválida ou expirada. Faça login novamente." }, { status: 401 });
      }
      let acc = null;
      try { acc = await svc.entities.AdminAccount.get(payload.sub); } catch { acc = null; }
      if (!acc || acc.is_active === false) {
        return Response.json({ error: "Conta de administrador desativada." }, { status: 401 });
      }
      return Response.json({ admin: sanitizeAdmin(acc) });
    }

    // A partir daqui, toda ação exige que o chamador seja administrador:
    // sessão própria válida (token) ou, na transição, conta da plataforma com
    // role "admin" ou e-mail cadastrado em Setting (admin_email até admin_email_5).
    const isAdmin = async () => {
      if (SECRET && body.token) {
        const payload = await verifyToken(body.token, SECRET);
        if (payload && payload.role === "admin") {
          let acc = null;
          try { acc = await svc.entities.AdminAccount.get(payload.sub); } catch { acc = null; }
          if (acc && acc.is_active !== false) return true;
        }
      }
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
    };

    if (!(await isAdmin())) {
      return Response.json({ error: "Acesso restrito ao administrador." }, { status: 403 });
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