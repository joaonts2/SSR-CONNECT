import { useEffect, useState } from "react";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const todayName = () => {
  const d = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
  const base = d.replace("-feira", "").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
};

export default function MenuCard() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await base44.entities.Menu.filter({ is_active: true });
        if (active) setMenu(all);
      } catch (e) { console.error(e); } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UtensilsCrossed className="h-5 w-5" /></span>
        <div>
          <h3 className="heading-font text-base font-bold">Cardápio do refeitório</h3>
          <p className="text-xs text-muted-foreground">O que será servido no almoço e no lanche esta semana</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : menu.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Cardápio ainda não publicado.</p>
        ) : (
          DAYS.map((d) => {
            const item = menu.find((m) => m.weekday === d);
            const isToday = d === todayName();
            return (
              <div key={d} className={`rounded-2xl border p-4 ${isToday ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isToday ? "text-primary" : ""}`}>{d}</p>
                  {isToday && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">Hoje</span>}
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <p className="text-sm"><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Lanche da manhã</span><span className="text-foreground">{item?.lanche_manha || "—"}</span></p>
                  <p className="text-sm"><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Almoço</span><span className="text-foreground">{item?.almoco || "—"}</span></p>
                  <p className="text-sm"><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Lanche da tarde</span><span className="text-foreground">{item?.lanche_tarde || "—"}</span></p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}