import { GraduationCap, LogOut, AlertCircle, BookOpen, Info, ClipboardList, Megaphone, UtensilsCrossed, ArrowRight } from "lucide-react";
import { changeAlunoPassword } from "@/lib/alunoAuth";
import { subjectsForCourse } from "@/lib/courses";
import MenuCard from "./MenuCard";
import NoticesCard from "./NoticesCard";
import ChangePasswordCard from "./ChangePasswordCard";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function AlunoDashboard({ session, onLogout }) {
  const subjects = subjectsForCourse(session.course);

  const tiles = [
    {
      key: "notas",
      icon: ClipboardList,
      title: "Notas e Boletim",
      desc: "Portal SEDUC-PI",
      tone: "bg-primary text-primary-foreground",
      href: "https://estudante.seduc.pi.gov.br/login",
      external: true,
    },
    {
      key: "avisos",
      icon: Megaphone,
      title: "Avisos da turma",
      desc: "Comunicados oficiais",
      tone: "bg-amber-500 text-white",
      target: "avisos",
    },
    {
      key: "cardapio",
      icon: UtensilsCrossed,
      title: "Cardápio semanal",
      desc: "Almoço e lanche",
      tone: "bg-secondary text-secondary-foreground",
      target: "cardapio",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><GraduationCap className="h-6 w-6" /></span>
            <div>
              <h2 className="heading-font text-lg font-bold">Olá, {session.name}</h2>
              <p className="text-xs text-muted-foreground">{session.turma || "Sem turma"} · {session.course || "Curso não definido"}</p>
              <p className="text-xs text-muted-foreground font-mono">{session.login}</p>
            </div>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"><LogOut className="h-3.5 w-3.5" /> Sair</button>
        </div>
        {session.mustChange && (
          <p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" /> Recomendamos que você troque sua senha agora.
          </p>
        )}
      </div>

      {/* Acessos rápidos */}
      <div>
        <h3 className="heading-font mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Acessos rápidos</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {tiles.map((t) => {
            const inner = (
              <>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.tone}`}><t.icon className="h-6 w-6" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </>
            );
            const cls = "flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:scale-[1.02] hover:border-primary/40";
            return t.external ? (
              <a key={t.key} href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <button key={t.key} type="button" onClick={() => scrollTo(t.target)} className={cls}>{inner}</button>
            );
          })}
        </div>
      </div>

      {/* Avisos da turma */}
      <div id="avisos" className="scroll-mt-4">
        <NoticesCard title={`Avisos da turma ${session.turma || ""}`} subtitle="Comunicados oficiais e específicos para a sua turma" turmas={[session.turma]} />
      </div>

      {/* Cardápio */}
      <div id="cardapio" className="scroll-mt-4">
        <MenuCard />
      </div>

      {/* Disciplinas */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></span>
          <div>
            <h3 className="heading-font text-base font-bold">Minhas disciplinas</h3>
            <p className="text-xs text-muted-foreground">{session.course || "Curso não definido"}{session.turma ? ` · ${session.turma}` : ""}</p>
          </div>
        </div>
        {subjects.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {subjects.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-4 text-center">
                <BookOpen className="mx-auto h-5 w-5 text-secondary" />
                <p className="mt-2 text-sm font-medium leading-snug">{s}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Nenhum curso técnico vinculado à sua matrícula ainda. Procure a secretaria para confirmar seu curso.
          </div>
        )}
      </div>

      <ChangePasswordCard onSubmit={(cur, next) => changeAlunoPassword(session.id, cur, next)} />
    </div>
  );
}