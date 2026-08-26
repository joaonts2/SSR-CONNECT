import { base44 } from "@/api/base44Client";

// Chamada única ao backend function portalApi — lança Error com a mensagem
// retornada pelo servidor (útil para os formulários do portal).
export async function portalApi(payload) {
  try {
    const res = await base44.functions.invoke("portalApi", payload);
    return res.data;
  } catch (e) {
    const msg = e?.response?.data?.error || e?.message || "Erro de comunicação.";
    throw new Error(msg);
  }
}