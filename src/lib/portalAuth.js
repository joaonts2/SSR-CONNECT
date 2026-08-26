import { base44 } from "@/api/base44Client";
import { sha256 } from "@/lib/alunoAuth";

// Sessão unificada do Portal Escolar (aluno / professor / pai).
const KEY = "ceti_portal_session";
export function getSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setSession(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
export function clearSession() { localStorage.removeItem(KEY); }

const normEmail = (e) => (e || "").trim().toLowerCase();

// ---------- Professor ----------
export async function loginTeacher(email, password) {
  const hash = await sha256(password);
  const rows = await base44.entities.Teacher.filter({ email: normEmail(email), is_active: true });
  const t = rows[0];
  if (!t || t.password_hash !== hash) throw new Error("E-mail ou senha incorretos.");
  return t;
}

export async function registerTeacher({ name, email, password, disciplines, turmas }) {
  const e = normEmail(email);
  const exists = await base44.entities.Teacher.filter({ email: e });
  if (exists.length) throw new Error("E-mail já cadastrado.");
  const password_hash = await sha256(password);
  const t = await base44.entities.Teacher.create({
    name: name.trim(), email: e, password_hash,
    disciplines: disciplines || "", turmas: turmas || "",
    is_active: true, password_changed: true,
  });
  return t;
}

export async function changeTeacherPassword(id, current, next) {
  const curHash = await sha256(current);
  const t = await base44.entities.Teacher.get(id);
  if (!t || t.password_hash !== curHash) throw new Error("Senha atual incorreta.");
  await base44.entities.Teacher.update(id, { password_hash: await sha256(next), password_changed: true });
}

// ---------- Pai / Mãe ----------
export async function loginParent(email, password) {
  const hash = await sha256(password);
  const rows = await base44.entities.Parent.filter({ email: normEmail(email), is_active: true });
  const p = rows[0];
  if (!p || p.password_hash !== hash) throw new Error("E-mail ou senha incorretos.");
  return p;
}

export async function registerParent({ name, email, password }) {
  const e = normEmail(email);
  const exists = await base44.entities.Parent.filter({ email: e });
  if (exists.length) throw new Error("E-mail já cadastrado.");
  const password_hash = await sha256(password);
  const p = await base44.entities.Parent.create({
    name: name.trim(), email: e, password_hash, student_ids: [],
    is_active: true, password_changed: true,
  });
  return p;
}

export async function changeParentPassword(id, current, next) {
  const curHash = await sha256(current);
  const p = await base44.entities.Parent.get(id);
  if (!p || p.password_hash !== curHash) throw new Error("Senha atual incorreta.");
  await base44.entities.Parent.update(id, { password_hash: await sha256(next), password_changed: true });
}