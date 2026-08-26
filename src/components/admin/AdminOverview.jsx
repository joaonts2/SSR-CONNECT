import { useEffect, useState } from "react";
import { Newspaper, CalendarDays, Users, Megaphone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import NewsManager from "./NewsManager";
import EventManager from "./EventManager";
import StudentManager from "./StudentManager";

const TABS = [
  { key: "news", label: "Notícias", icon: Newspaper, Component: NewsManager },
  { key: "events", label: "Eventos", icon: CalendarDays, Component: EventManager },
  { key: "students", label: "Alunos", icon: Users, Component: StudentManager },
];

// Tela central do painel: contagem rápida + abas para editar notícias, eventos
// e alunos sem precisar navegar pela barra lateral.
export default function AdminOverview() {
  const [tab, setTab] = useState("news");
  const [counts, setCounts] = useState({ news: 0, events: 0, students: 0, notices: 0 });

  useEffect(() => {
    Promise.all([
      base44.entities.News.list().then((r) => r.length).catch(() => 0),
      base44.entities.CalendarEvent.list().then((r) => r.length).catch(() => 0),
      base44.entities.Student.list().then((r) => r.length).catch(() => 0),
      base44.entities.Notice.filter({ is_active: true }).then((r) => r.length).catch(() => 0),
    ]).then(([news, events, students, notices]) => setCounts({ news, events, students, notices }));
  }, []);

  const stats = [
    { key: "news", icon: Newspaper, label: "Notícias", tone: "text-primary bg-primary/10" },
    { key: "events", icon: CalendarDays, label: "Eventos", tone: "text-secondary bg-secondary/10" },
    { key: "students", icon: Users, label: "Alunos", tone: "text-amber-600 bg-amber-500/10" },
    { key: "notices", icon: Megaphone, label: "Avisos ativos", tone: "text-primary bg-primary/10" },
  ];

  const Active = TABS.find((t) => t.key === tab).Component;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-font text-2xl font-bold">Visão geral</h2>
        <p className="text-sm text-muted-foreground">Edite notícias, eventos e alunos em uma única tela central.</p>
      </div>

      {/* Cards de contagem */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}><s.icon className="h-5 w-5" /></span>
            <div>
              <p className="heading-font text-2xl font-bold leading-none">{counts[s.key]}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Abas centrais */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === t.key ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-card text-muted-foreground hover:text-primary"}`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tab === t.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* Gerenciador ativo */}
      <Active />
    </div>
  );
}