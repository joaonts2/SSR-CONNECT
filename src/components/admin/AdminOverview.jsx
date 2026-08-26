import { useEffect, useState } from "react";
import { Newspaper, CalendarDays, Users, Megaphone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { adminList } from "@/lib/adminApi";
import NewsManager from "./NewsManager";
import EventManager from "./EventManager";
import StudentManager from "./StudentManager";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const SECTIONS = [
  { key: "news", label: "Notícias", icon: Newspaper, Manager: NewsManager, desc: "Publicar e editar notícias do portal" },
  { key: "events", label: "Eventos", icon: CalendarDays, Manager: EventManager, desc: "Calendário escolar, provas e atividades" },
  { key: "students", label: "Alunos", icon: Users, Manager: StudentManager, desc: "Turmas, logins e senhas" },
];

// Tela centralizada do painel: todas as áreas de gestão visíveis ao mesmo tempo
// em seções empilhadas, com navegação rápida por âncora para edição ágil.
export default function AdminOverview() {
  const [counts, setCounts] = useState({ news: 0, events: 0, students: 0, notices: 0 });

  useEffect(() => {
    Promise.all([
      adminList("News").then((r) => r.length).catch(() => 0),
      adminList("CalendarEvent").then((r) => r.length).catch(() => 0),
      adminList("Student").then((r) => r.length).catch(() => 0),
      adminList("Notice", { filter: { is_active: true } }).then((r) => r.length).catch(() => 0),
    ]).then(([news, events, students, notices]) => setCounts({ news, events, students, notices }));
  }, []);

  const stats = [
    { key: "news", icon: Newspaper, label: "Notícias", tone: "text-primary bg-primary/10" },
    { key: "events", icon: CalendarDays, label: "Eventos", tone: "text-secondary bg-secondary/10" },
    { key: "students", icon: Users, label: "Alunos", tone: "text-amber-600 bg-amber-500/10" },
    { key: "notices", icon: Megaphone, label: "Avisos ativos", tone: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="heading-font text-2xl font-bold">Painel central</h2>
        <p className="text-sm text-muted-foreground">Gerencie notícias, eventos e alunos em uma única tela — tudo visível para edição rápida.</p>
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

      {/* Navegação rápida por âncora */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => scrollTo(s.key)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <s.icon className="h-4 w-4" /> {s.label}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{counts[s.key]}</span>
          </button>
        ))}
      </div>

      {/* Seções empilhadas — todas editáveis na mesma tela */}
      {SECTIONS.map((s) => (
        <section key={s.key} id={s.key} className="scroll-mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
            <div>
              <h3 className="heading-font text-lg font-bold">{s.label}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
          <s.Manager />
        </section>
      ))}
    </div>
  );
}