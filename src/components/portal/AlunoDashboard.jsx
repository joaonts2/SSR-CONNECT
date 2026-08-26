import { GraduationCap, LogOut, AlertCircle, BookOpen, Info, ClipboardList, ExternalLink } from "lucide-react";
import { changeAlunoPassword } from "@/lib/alunoAuth";
import { subjectsForCourse } from "@/lib/courses";
import MenuCard from "./MenuCard";
import NoticesCard from "./NoticesCard";
import ChangePasswordCard from "./ChangePasswordCard";

export default function AlunoDashboard({ session, onLogout }) {
  const subjects = subjectsForCourse(session.course);

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

      {/* Notas */}
      <a href="https://estudante.seduc.pi.gov.br/login" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-5 transition hover:scale-[1.01] sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ClipboardList className="h-6 w-6" /></span>
          <div>
            <h3 className="heading-font text-base font-bold">Notas e Boletim</h3>
            <p className="text-xs text-muted-foreground">Acesse o portal do estudante da SEDUC-PI para ver suas notas</p>
          </div>
        </div>
        <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
      </a>

      <NoticesCard title={`Avisos da turma ${session.turma || ""}`} subtitle="Comunicados oficiais e específicos para a sua turma" turmas={[session.turma]} />

      <MenuCard />

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