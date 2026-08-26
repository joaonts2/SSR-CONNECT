import { useEffect, useState } from "react";
import { Save, Loader2, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function MenuManager() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(null);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.Menu.list();
    const map = {};
    for (const d of DAYS) {
      const r = all.find((x) => x.weekday === d);
      map[d] = { id: r?.id, almoco: r?.almoco || "", lanche: r?.lanche || "" };
    }
    setForm(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const set = (day, field) => (e) =>
    setForm((f) => ({ ...f, [day]: { ...f[day], [field]: e.target.value } }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setOk(null);
    for (const d of DAYS) {
      const cur = form[d];
      if (!cur) continue;
      if (cur.id) {
        await base44.entities.Menu.update(cur.id, { almoco: cur.almoco, lanche: cur.lanche });
      } else {
        await base44.entities.Menu.create({ weekday: d, almoco: cur.almoco, lanche: cur.lanche, is_active: true });
      }
    }
    setSaving(false); setOk("Cardápio salvo!"); load();
  };

  if (loading) return <Loader2 className="mt-10 h-6 w-6 animate-spin text-primary" />;

  return (
    <form onSubmit={save}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UtensilsCrossed className="h-5 w-5" /></span>
        <div>
          <h2 className="heading-font text-2xl font-bold">Cardápio do refeitório</h2>
          <p className="text-sm text-muted-foreground">Defina o almoço e o lanche de cada dia da semana</p>
        </div>
      </div>

      {ok && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
          <CheckCircle2 className="h-4 w-4" /> {ok}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {DAYS.map((d) => (
          <div key={d} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="heading-font text-sm font-bold">{d}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Almoço</label>
                <textarea rows={2} value={form[d]?.almoco || ""} onChange={set(d, "almoco")} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary transition focus:ring-2" placeholder="Ex.: Arroz, feijão, carne..." />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lanche</label>
                <textarea rows={2} value={form[d]?.lanche || ""} onChange={set(d, "lanche")} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary transition focus:ring-2" placeholder="Ex.: Pão com manteiga, suco..." />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar cardápio
        </button>
      </div>
    </form>
  );
}