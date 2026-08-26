// Auth leve do Portal do Aluno (não usa o login de e-mail da plataforma).
// As senhas são guardadas apenas como hash SHA-256 — o administrador vê a
// senha em texto apenas no momento da geração e a entrega ao aluno em mãos.

import { base44 } from "@/api/base44Client";

const SESSION_KEY = "aluno_session";
// Sufixo de e-mail dos logins dos alunos (formato institucional).
const LOGIN_DOMAIN = "@aluno.cetisebastiaosoribeiro.edu.br";

export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// "João Silva Souza" -> ["joao", "silva", "souza"]
function slugifyName(name) {
  return (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// Gera um login único no padrão "primeiro.último" evitando colisões.
// Compara o login COMPLETO (com sufixo de e-mail) contra os já existentes,
// caso contrário "joao.silva" nunca colidiria com "joao.silva@..." e alunos
// homônimos receberiam logins duplicados, quebrando o acesso ao portal.
export function genLogin(name, existing = []) {
  const parts = slugifyName(name);
  const base =
    parts.length >= 2
      ? `${parts[0]}.${parts[parts.length - 1]}`
      : parts[0] || "aluno";
  const taken = new Set((existing || []).map((l) => (l || "").toLowerCase()));
  let login = `${base}${LOGIN_DOMAIN}`;
  let n = 1;
  while (taken.has(login.toLowerCase())) {
    n += 1;
    login = `${base}${n}${LOGIN_DOMAIN}`;
  }
  return login;
}

// Senha aleatória curta, sem caracteres ambíguos (0/O, 1/l).
export function genPassword(len = 8) {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

export function getAluno() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
export function setAluno(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
export function clearAluno() {
  localStorage.removeItem(SESSION_KEY);
}

// Normaliza o login digitado: se o aluno informou só o "joao.silva" sem o
// domínio institucional, completa automaticamente antes de buscar no banco.
function normalizeLogin(login) {
  let l = (login || "").trim().toLowerCase();
  if (l && !l.includes("@")) l = `${l}${LOGIN_DOMAIN}`;
  return l;
}

// Login do aluno: busca o cadastro pelo login e compara o hash da senha.
export async function loginAluno(login, password) {
  const hash = await sha256(password);
  const rows = await base44.entities.Student.filter({
    login: normalizeLogin(login),
    is_active: true,
  });
  const aluno = rows[0];
  if (!aluno || aluno.password_hash !== hash) {
    throw new Error("Login ou senha incorretos.");
  }
  return aluno;
}

// Troca de senha pelo próprio aluno: valida a senha atual antes de atualizar.
export async function changeAlunoPassword(id, current, next) {
  const curHash = await sha256(current);
  const aluno = await base44.entities.Student.get(id);
  if (!aluno || aluno.password_hash !== curHash) {
    throw new Error("Senha atual incorreta.");
  }
  const newHash = await sha256(next);
  await base44.entities.Student.update(id, {
    password_hash: newHash,
    password_changed: true,
  });
}