import { Briefcase, LogOut, BookOpen, GraduationCap } from "lucide-react";
import { changeTeacherPassword } from "@/lib/portalAuth";
import MenuCard from "./MenuCard";
import NoticesCard from "./NoticesCard";
import ChangePasswordCard from "./ChangePasswordCard";

export default function ProfessorDashboard({ session, onLogout }) {
  const disciplines = session.disciplines ? session.disciplines.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const turmas = session.turmas ? session.turmas.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Briefcase className="h-6 w-6" /></span>
            <div>
              <h2 className="heading-font text-lg font-bold">Olá, {session.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">{session.email}</p>
            </div>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"><LogOut className="h-3.5 w-3.5" /> Sair</button>
        </div>
        {(disciplines.length > 0 || turmas.length > 0) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <span key={d} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><BookOpen className="h-3 w-3" /> {d}</span>
            ))}
            {turmas.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary"><GraduationCap className="h-3 w-3" /> {t}</span>
            ))}
          </div>
        )}
      </div>

      <NoticesCard title="Avisos e comunicados" subtitle="Todos os avisos ativos da escola" turmas={null} />

      <MenuCard />

      <ChangePasswordCard onSubmit={(cur, next) => changeTeacherPassword(session.id, cur, next)} />
    </div>
  );
}