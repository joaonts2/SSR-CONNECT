import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Camada de autenticação e dados do Portal Escolar (aluno / professor / pai).
// Roda com service role para contornar o RLS admin-only de Student/Parent/Teacher,
// valida as credenciais e sessões no servidor e NUNCA retorna password_hash.
// Grava apenas no backend; o cliente recebe objetos sanitizados.

const LOGIN_DOMAIN = "@aluno.cetisebastiaosoribeiro.edu.br";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeLogin(login) {
  let l = (login || "").trim().toLowerCase();
  if (l && !l.includes("@")) l = `${l}${LOGIN_DOMAIN}`;
  return l;
}
function normEmail(e) {
  return (e || "").trim().toLowerCase();
}

function sanitizeStudent(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    student_login: s.student_login,
    turma: s.turma || "",
    course: s.course || "",
    enrollment: s.enrollment || "",
    is_active: s.is_active,
    password_changed: s.password_changed,
  };
}
function sanitizeTeacher(t) {
  if (!t) return null;
  return {
    id: t.id,
    name: t.name,
    email: t.email,
    disciplines: t.disciplines || "",
    turmas: t.turmas || "",
    password_changed: t.password_changed,
  };
}
function sanitizeParent(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    student_ids: p.student_ids || [],
    password_changed: p.password_changed,
  };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const svc = base44.asServiceRole;
    const body = await req.json();
    const action = body.action;

    // ---------- Aluno ----------
    if (action === "studentLogin") {
      const hash = await sha256(body.password);
      const rows = await svc.entities.Student.filter({
        student_login: normalizeLogin(body.login),
        is_active: true,
      });
      const s = rows[0];
      if (!s || s.password_hash !== hash) {
        return Response.json({ error: "Login ou senha incorretos." }, { status: 401 });
      }
      return Response.json({ student: sanitizeStudent(s) });
    }

    if (action === "studentProfile") {
      const s = await svc.entities.Student.get(body.id);
      if (!s) return Response.json({ error: "Aluno não encontrado." }, { status: 404 });
      return Response.json({ student: sanitizeStudent(s) });
    }

    if (action === "studentChangePassword") {
      const cur = await sha256(body.current);
      const s = await svc.entities.Student.get(body.id);
      if (!s || s.password_hash !== cur) {
        return Response.json({ error: "Senha atual incorreta." }, { status: 400 });
      }
      await svc.entities.Student.update(body.id, {
        password_hash: await sha256(body.next),
        password_changed: true,
      });
      return Response.json({ ok: true });
    }

    // ---------- Professor ----------
    if (action === "teacherLogin") {
      const hash = await sha256(body.password);
      const rows = await svc.entities.Teacher.filter({
        email: normEmail(body.email),
        is_active: true,
      });
      const t = rows[0];
      if (!t || t.password_hash !== hash) {
        return Response.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
      }
      return Response.json({ teacher: sanitizeTeacher(t) });
    }

    if (action === "teacherRegister") {
      const e = normEmail(body.email);
      const exists = await svc.entities.Teacher.filter({ email: e });
      if (exists.length) {
        return Response.json({ error: "E-mail já cadastrado." }, { status: 400 });
      }
      const password_hash = await sha256(body.password);
      const t = await svc.entities.Teacher.create({
        name: (body.name || "").trim(),
        email: e,
        password_hash,
        disciplines: body.disciplines || "",
        turmas: body.turmas || "",
        is_active: true,
        password_changed: true,
      });
      return Response.json({ teacher: sanitizeTeacher(t) });
    }

    if (action === "teacherChangePassword") {
      const cur = await sha256(body.current);
      const t = await svc.entities.Teacher.get(body.id);
      if (!t || t.password_hash !== cur) {
        return Response.json({ error: "Senha atual incorreta." }, { status: 400 });
      }
      await svc.entities.Teacher.update(body.id, {
        password_hash: await sha256(body.next),
        password_changed: true,
      });
      return Response.json({ ok: true });
    }

    // ---------- Pai / Mãe ----------
    if (action === "parentLogin") {
      const hash = await sha256(body.password);
      const rows = await svc.entities.Parent.filter({
        email: normEmail(body.email),
        is_active: true,
      });
      const p = rows[0];
      if (!p || p.password_hash !== hash) {
        return Response.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
      }
      return Response.json({ parent: sanitizeParent(p) });
    }

    if (action === "parentRegister") {
      const e = normEmail(body.email);
      const exists = await svc.entities.Parent.filter({ email: e });
      if (exists.length) {
        return Response.json({ error: "E-mail já cadastrado." }, { status: 400 });
      }
      const password_hash = await sha256(body.password);
      const p = await svc.entities.Parent.create({
        name: (body.name || "").trim(),
        email: e,
        password_hash,
        student_ids: [],
        is_active: true,
        password_changed: true,
      });
      return Response.json({ parent: sanitizeParent(p) });
    }

    if (action === "parentChangePassword") {
      const cur = await sha256(body.current);
      const p = await svc.entities.Parent.get(body.id);
      if (!p || p.password_hash !== cur) {
        return Response.json({ error: "Senha atual incorreta." }, { status: 400 });
      }
      await svc.entities.Parent.update(body.id, {
        password_hash: await sha256(body.next),
        password_changed: true,
      });
      return Response.json({ ok: true });
    }

    // ---------- Dados (professor / pai) ----------
    if (action === "studentsByTurma") {
      if (body.teacherId) {
        const t = await svc.entities.Teacher.get(body.teacherId);
        if (!t) return Response.json({ error: "Sessão inválida." }, { status: 401 });
      }
      const all = await svc.entities.Student.list();
      const turmas = body.turmas || [];
      const filtered = turmas.length
        ? all.filter((s) => turmas.includes(s.turma))
        : all;
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return Response.json({ students: filtered.map(sanitizeStudent) });
    }

    if (action === "updateStudent") {
      const t = await svc.entities.Teacher.get(body.teacherId);
      if (!t) return Response.json({ error: "Sessão inválida." }, { status: 401 });
      const allowed = ["turma", "course", "enrollment", "is_active"];
      const patch = {};
      for (const k of allowed) {
        if (k in (body.patch || {})) patch[k] = body.patch[k];
      }
      await svc.entities.Student.update(body.id, patch);
      return Response.json({ ok: true });
    }

    if (action === "parentChildren") {
      const ids = body.ids || [];
      if (!ids.length) return Response.json({ students: [] });
      const all = await svc.entities.Student.list();
      return Response.json({
        students: all.filter((s) => ids.includes(s.id)).map(sanitizeStudent),
      });
    }

    if (action === "linkChild") {
      const p = await svc.entities.Parent.get(body.parentId);
      if (!p) return Response.json({ error: "Sessão inválida." }, { status: 401 });
      const rows = await svc.entities.Student.filter({
        student_login: normalizeLogin(body.studentLogin),
        is_active: true,
      });
      const s = rows[0];
      if (!s) {
        return Response.json(
          { error: "Aluno não encontrado. Verifique o login informado." },
          { status: 400 }
        );
      }
      const cur = p.student_ids || [];
      if (cur.includes(s.id)) {
        return Response.json({ error: "Este filho já está vinculado." }, { status: 400 });
      }
      const updated = [...cur, s.id];
      await svc.entities.Parent.update(body.parentId, { student_ids: updated });
      return Response.json({ student_ids: updated });
    }

    // ---------- Aulas (professor) ----------
    if (action === "createLesson") {
      const t = await svc.entities.Teacher.get(body.teacherId);
      if (!t) return Response.json({ error: "Sessão inválida." }, { status: 401 });
      const l = body.lesson || {};
      const rec = await svc.entities.Lesson.create({
        title: (l.title || "").trim(),
        description: (l.description || "").trim(),
        type: l.type || "Vídeo",
        url: (l.url || "").trim(),
        turma: l.turma || "",
        discipline: (l.discipline || "").trim(),
        author: l.author || t.name || "Professor",
        date: new Date().toISOString().slice(0, 10),
        is_active: true,
      });
      return Response.json({ lesson: rec });
    }

    if (action === "deleteLesson") {
      const t = await svc.entities.Teacher.get(body.teacherId);
      if (!t) return Response.json({ error: "Sessão inválida." }, { status: 401 });
      await svc.entities.Lesson.delete(body.id);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Ação desconhecida." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}