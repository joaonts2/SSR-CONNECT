import { portalApi } from "@/lib/portalApi";

// Sessão unificada do Portal Escolar (aluno / professor / pai).
const KEY = "ceti_portal_session";
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export function setSession(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function clearSession() {
  localStorage.removeItem(KEY);
}

// ---------- Professor ----------
export async function loginTeacher(email, password) {
  const { teacher } = await portalApi({ action: "teacherLogin", email, password });
  return teacher;
}

export async function registerTeacher({ name, email, password, disciplines, turmas }) {
  const { teacher } = await portalApi({
    action: "teacherRegister",
    name,
    email,
    password,
    disciplines,
    turmas,
  });
  return teacher;
}

export async function changeTeacherPassword(id, current, next) {
  await portalApi({ action: "teacherChangePassword", id, current, next });
}

// ---------- Pai / Mãe ----------
export async function loginParent(email, password) {
  const { parent } = await portalApi({ action: "parentLogin", email, password });
  return parent;
}

export async function registerParent({ name, email, password }) {
  const { parent } = await portalApi({ action: "parentRegister", name, email, password });
  return parent;
}

export async function changeParentPassword(id, current, next) {
  await portalApi({ action: "parentChangePassword", id, current, next });
}