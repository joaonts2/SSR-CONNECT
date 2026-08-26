import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SLOTS = [
  { key: "admin_email", label: "Administrador principal" },
  { key: "admin_email_2", label: "Administrador 2" },
  { key: "admin_email_3", label: "Administrador 3" },
];

export default function AdminAccessManager() {
  const [records, setRecords] = useState({}); // { key: record|null }
  const [emails, setEmails] = useState({}); // { key: string }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msgs, setMsgs] = useState({}); // { key: {type,text} }

  useEffect(() => {
    (async () => {
      try {
        const rows = await base44.entities.Setting.list();
        const recMap = {};
        const mailMap = {};
        SLOTS.forEach((s) => {
          const rec = rows.find((r) => r.key === s.key) || null;
          recMap[s.key] = rec;
          mailMap[s.key] = rec?.value || "";
        });
        setRecords(recMap);
        setEmails(mailMap);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const setField = (key, value) => {
    setEmails((p) => ({ ...p, [key]: value }));
    setMsgs((p) => ({ ...p, [key]: undefined }));
  };

  const saveSlot = async (slot) => {
    const trimmed = (emails[slot.key] || "").trim().toLowerCase();
    const rec = records[slot.key];
    if (rec && (rec.value || "").toLowerCase().trim() === trimmed) {
      setMsgs((p) => ({ ...p, [slot.key]: { type: "info", text: "Nenhuma alteração." } }));
      return null;
    }
    try {
      if (!trimmed) {
        // remover
        if (rec?.id) {
          await base44.entities.Setting.delete(rec.id);
          setRecords((p) => ({ ...p, [slot.key]: null }));
        }
        setMsgs((p) => ({ ...p, [slot.key]: { type: "success", text: "Administrador removido." } }));
        return null;
      }
      if (rec?.id) {
        const updated = await base44.entities.Setting.update(rec.id, { value: trimmed });
        setRecords((p) => ({ ...p, [slot.key]: updated }));
      } else {
        const created = await base44.entities.Setting.create({ key: slot.key, value: trimmed });
        setRecords((p) => ({ ...p, [slot.key]: created }));
      }
      setMsgs((p) => ({ ...p, [slot.key]: { type: "success", text: "Administrador salvo." } }));
      return null;
    } catch (err) {
      console.error(err);
      setMsgs((p) => ({ ...p, [slot.key]: { type: "error", text: "Sem permissão para alterar este administrador." } }));
      return err;
    }
  };

  const saveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    await Promise.all(SLOTS.map((s) => saveSlot(s)));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h2 className="heading-font text-xl font-bold">Acesso dos administradores</h2>
          <p className="text-sm text-muted-foreground">Defina até 3 e-mails que podem acessar este painel. Apenas o administrador atual pode alterá-los.</p>
        </div>
      </div>

      <form onSubmit={saveAll} className="mt-6 max-w-md space-y-5">
        {SLOTS.map((slot, idx) => {
          const msg = msgs[slot.key];
          return (
            <div key={slot.key}>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{idx + 1}</span>
                {slot.label}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={emails[slot.key] || ""}
                  onChange={(e) => setField(slot.key, e.target.value)}
                  placeholder="admin@escola.com"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-sm outline-none ring-primary transition focus:ring-2"
                />
                {records[slot.key] && (emails[slot.key] || "").trim() && (
                  <button
                    type="button"
                    onClick={() => setField(slot.key, "")}
                    title="Remover"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {msg && (
                <p className={`mt-1.5 text-xs ${msg.type === "success" ? "text-secondary" : msg.type === "info" ? "text-muted-foreground" : "text-destructive"}`}>
                  {msg.text}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Salvar administradores
        </button>
      </form>

      <p className="mt-6 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
        Ao adicionar ou trocar um e-mail, o acesso a este painel passa a pertencer também à nova conta. Certifique-se de que os e-mails já estejam registrados na plataforma antes de salvar.
      </p>
    </div>
  );
}