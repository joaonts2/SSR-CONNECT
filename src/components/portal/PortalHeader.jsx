import { LogOut, AlertCircle } from "lucide-react";

// Cabeçalho padronizado dos dashboards do portal: avatar com iniciais,
// nome + meta, chips de contexto e alerta de troca de senha.
export default function PortalHeader({ name, meta, role, avatarClass = "bg-primary text-primary-foreground", icon: Icon, chips, mustChange, onLogout }) {
  const initials = (name || "")
    .split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/5 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold ${avatarClass}`}>
            {initials || (Icon && <Icon className="h-6 w-6" />)}
          </span>
          <div>
            {role && <p className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-primary">{role}</p>}
            <h2 className="heading-font text-xl font-bold">Olá, {name}</h2>
            {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
          </div>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted">
          <LogOut className="h-3.5 w-3.5" /> Sair
        </button>
      </div>

      {chips?.length > 0 && (
        <div className="relative mt-5 flex flex-wrap gap-2">{chips}</div>
      )}

      {mustChange && (
        <p className="relative mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" /> Recomendamos que você troque sua senha agora.
        </p>
      )}
    </div>
  );
}