import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, GraduationCap, Megaphone } from "lucide-react";
import PageHero from "@/components/PageHero";

const events = {
  "2026-08-12": { title: "Reunião de Pais — Ensino Médio", time: "19h00", local: "Auditório Principal", type: "Reunião" },
  "2026-08-20": { title: "Inscrições Feira de Ciências", time: "Encerramento", local: "Online", type: "Evento" },
  "2026-08-24": { title: "Simulado Vestibular", time: "08h00", local: "Salas 201-210", type: "Prova" },
  "2026-08-18": { title: "Entrega de Boletins", time: "17h00", local: "Secretaria", type: "Acadêmico" },
  "2026-09-07": { title: "Semana da Independência", time: "Programação especial", local: "Quadra Coberta", type: "Evento" },
  "2026-09-15": { title: "Prova Bimestral — Matemática", time: "08h00", local: "Todas as salas", type: "Prova" },
  "2026-09-22": { title: "Conselho de Classe", time: "18h00", local: "Sala de Professores", type: "Reunião" },
  "2026-10-03": { title: "Festa das Famílias", time: "14h00", local: "Pátio Principal", type: "Evento" },
};

const typeColors = {
  Prova: "bg-amber-500",
  Evento: "bg-emerald-500",
  Reunião: "bg-blue-500",
  Acadêmico: "bg-violet-500",
};

const upcoming = [
  { date: "12 Ago", title: "Reunião de Pais — Ensino Médio", time: "19h00 · Auditório", type: "Reunião" },
  { date: "18 Ago", title: "Entrega de Boletins", time: "17h00 · Secretaria", type: "Acadêmico" },
  { date: "20 Ago", title: "Inscrições Feira de Ciências", time: "Encerramento", type: "Evento" },
  { date: "24 Ago", title: "Simulado Vestibular", time: "08h00 · Salas 201-210", type: "Prova" },
  { date: "07 Set", title: "Semana da Independência", time: "Programação especial", type: "Evento" },
  { date: "15 Set", title: "Prova Bimestral — Matemática", time: "08h00 · Todas as salas", type: "Prova" },
];

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendar() {
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1)); // Agosto 2026
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateKey = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div>
      <PageHero
        eyebrow="Calendário Escolar"
        title="Organize seu ano letivo"
        description="Provas, eventos, reuniões e feriados — tudo em um calendário claro e acessível."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="heading-font text-xl font-bold">{months[month]} {year}</h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} aria-label="Mês anterior" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-primary/10 hover:text-primary">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={nextMonth} aria-label="Próximo mês" className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-primary/10 hover:text-primary">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {weekDays.map((d) => (
                  <div key={d} className="py-2 text-center text-xs font-semibold uppercase text-muted-foreground">{d}</div>
                ))}
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const ev = events[dateKey(day)];
                  return (
                    <div
                      key={i}
                      className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border p-1 text-sm transition ${
                        ev ? "border-primary/40 bg-primary/5" : "border-border bg-background"
                      } hover:shadow-sm`}
                    >
                      <span className={`font-medium ${ev ? "text-primary" : "text-foreground"}`}>{day}</span>
                      {ev && <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${typeColors[ev.type] || "bg-primary"}`} />}
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-4">
                {Object.entries(typeColors).map(([t, c]) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`h-2.5 w-2.5 rounded-full ${c}`} /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Eventos do mês */}
            <div className="mt-6 space-y-3">
              {cells.filter((d) => d && events[dateKey(d)]).map((day) => {
                const ev = events[dateKey(day)];
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                      <span className="heading-font text-xl font-bold leading-none">{day}</span>
                      <span className="text-[10px] uppercase">{months[month].slice(0, 3)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-white ${typeColors[ev.type]}`}>{ev.type}</span>
                        <h3 className="text-sm font-semibold">{ev.title}</h3>
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ev.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.local}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Próximos eventos */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="heading-font flex items-center gap-2 text-lg font-bold">
                <Megaphone className="h-5 w-5 text-primary" /> Próximos eventos
              </h3>
              <div className="mt-5 space-y-4">
                {upcoming.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary">
                      <span className="heading-font text-sm font-bold leading-none">{e.date.split(" ")[0]}</span>
                      <span className="text-[9px] uppercase">{e.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white ${typeColors[e.type]}`}>{e.type}</span>
                      <h4 className="mt-0.5 text-sm font-semibold leading-snug">{e.title}</h4>
                      <p className="text-xs text-muted-foreground">{e.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-amber-500" />
                <h3 className="heading-font text-base font-bold">Calendário de Provas</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">As provas bimestrais estão destacadas em amarelo no calendário. Consulte o portal do aluno para conteúdos programáticos.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}