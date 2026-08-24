import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ADMIN_KEY = "admin_email";

export default function AdminAccessManager() {
  const [record, setRecord] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const rows = await base44.entities.Setting.filter({ key: ADMIN_KEY });
        const rec = rows[0] || null;
        setRecord(rec);
        setEmail(rec?.value || "");
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setSaving(true);
    setMsg(null);
    try {
      if (record?.id) {
        const updated = await base44.entities.Setting.update(record.id, { value: trimmed });
        setRecord(updated);
      } else {
        const created = await base44.entities.Setting.create({ key: ADMIN_KEY, value: trimmed });
        setRecord(created);
      }
      setEmail(trimmed);
      setMsg({ type: "success", text: "E-mail administrador atualizado com sucesso." });
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Não foi possível atualizar — verifique se você é o administrador atual." });
    }
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
          <h2 className="heading-font text-xl font-bold">Acesso do administrador</h2>
          <p className="text-sm text-muted-foreground">Defina qual e-mail pode acessar este painel. Apenas o administrador atual pode alterá-lo.</p>
        </div>
      </div>

      <form onSubmit={save} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">E-mail administrador</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@escola.com"
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none ring-primary transition focus:ring-2"
            />
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg.type === "success" ? "text-secondary" : "text-destructive"}`}>{msg.text}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Salvar e-mail
        </button>
      </form>

      <p className="mt-6 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
        Ao trocar o e-mail, o acesso a este painel passa a pertencer apenas à nova conta. Certifique-se de que o novo e-mail já esteja registrado na plataforma antes de salvar.
      </p>
    </div>
  );
}