// Título de seção usado para agrupar cartões dos dashboards do portal.
export default function PortalSectionTitle({ children }) {
  return (
    <div className="pt-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
    </div>
  );
}