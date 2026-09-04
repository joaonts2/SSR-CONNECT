// Navegação de seções do painel admin — tiles compactos com ícone (mobile/tablet).
export default function AdminSectionNav({ sections, active, onSelect }) {
  return (
    <div className="lg:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seções</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {sections.map((s) => {
          const isActive = active === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <s.icon className="h-5 w-5 shrink-0" />
              <span className="text-[11px] font-semibold leading-tight">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}