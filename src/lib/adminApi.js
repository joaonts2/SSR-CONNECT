import { base44 } from "@/api/base44Client";

// Chamadas ao backend function adminApi (service role) — contornam o RLS admin-only
// e validam o acesso no servidor. Lança Error com a mensagem retornada.
async function call(payload) {
  try {
    const res = await base44.functions.invoke("adminApi", payload);
    return res.data;
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || "Erro de comunicação.";
    throw new Error(msg);
  }
}

export function adminList(entity, { sort, limit, filter } = {}) {
  return call({ action: "list", entity, sort, limit, filter }).then((d) => d.rows);
}
export function adminCreate(entity, data) {
  return call({ action: "create", entity, data }).then((d) => d.record);
}
export function adminUpdate(entity, id, data) {
  return call({ action: "update", entity, id, data }).then((d) => d.record);
}
export function adminDelete(entity, id) {
  return call({ action: "delete", entity, id });
}
export function adminBulkCreate(entity, records) {
  return call({ action: "bulkCreate", entity, records }).then((d) => d.records);
}
export function adminEmails() {
  return call({ action: "adminEmails" }).then((d) => d.rows);
}
export function amIAdmin() {
  return call({ action: "amIAdmin" }).then((d) => !!d.isAdmin);
}