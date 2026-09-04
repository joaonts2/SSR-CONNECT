import { useState } from "react";
import { Newspaper, Megaphone, CalendarDays, MessageSquare, ShieldCheck, Users, UtensilsCrossed, Phone, LayoutDashboard, Radio } from "lucide-react";
import PageHero from "@/components/PageHero";
import AdminOverview from "@/components/admin/AdminOverview";
import NewsManager from "@/components/admin/NewsManager";
import NoticeManager from "@/components/admin/NoticeManager";
import EventManager from "@/components/admin/EventManager";
import TestimonialManager from "@/components/admin/TestimonialManager";
import AdminAccessManager from "@/components/admin/AdminAccessManager";
import StudentManager from "@/components/admin/StudentManager";
import TeacherManager from "@/components/admin/TeacherManager";
import MenuManager from "@/components/admin/MenuManager";
import ContactInfoManager from "@/components/admin/ContactInfoManager";
import TickerManager from "@/components/admin/TickerManager";
import AdminSectionNav from "@/components/admin/AdminSectionNav";

const SECTIONS = [
  { key: "overview", label: "Início", group: "Início", icon: LayoutDashboard, desc: "Visão geral do portal", Component: AdminOverview },
  { key: "news", label: "Notícias", group: "Conteúdo", icon: Newspaper, desc: "Publicar e editar notícias", Component: NewsManager },
  { key: "notices", label: "Avisos", group: "Conteúdo", icon: Megaphone, desc: "Mural de avisos e comunicados", Component: NoticeManager },
  { key: "events", label: "Eventos", group: "Conteúdo", icon: CalendarDays, desc: "Calendário escolar e provas", Component: EventManager },
  { key: "menu", label: "Cardápio", group: "Conteúdo", icon: UtensilsCrossed, desc: "Almoço e lanche da semana", Component: MenuManager },
  { key: "testimonials", label: "Depoimentos", group: "Conteúdo", icon: MessageSquare, desc: "Aprovar depoimentos da comunidade", Component: TestimonialManager },
  { key: "contact", label: "Contato", group: "Conteúdo", icon: Phone, desc: "Textos e dados da página de contato", Component: ContactInfoManager },
  { key: "ticker", label: "Banner Avisos", group: "Conteúdo", icon: Radio, desc: "Frase do topo da página inicial", Component: TickerManager },
  { key: "students", label: "Alunos", group: "Pessoas", icon: Users, desc: "Listas por turma e logins/senhas", Component: StudentManager },
  { key: "teachers", label: "Professores", group: "Pessoas", icon: Users, desc: "Aprovar cadastros e definir turmas", Component: TeacherManager },
  { key: "access", label: "Acesso", group: "Configurações", icon: ShieldCheck, desc: "Definir e-mail do administrador", Component: AdminAccessManager },
];

const NAV_GROUPS = ["Início", "Conteúdo", "Pessoas", "Configurações"];

export default function Admin() {
  const [active, setActive] = useState("overview");
  const Current = SECTIONS.find((s) => s.key === active).Component;

  return (
    <div>
      <PageHero
        eyebrow="Painel Administrativo"
        title="Gestão de conteúdo"
        description="Edite notícias, avisos e eventos do calendário sem precisar alterar o código."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {/* Navegação mobile: grid compacto com ícone + rótulo */}
            <AdminSectionNav sections={SECTIONS} active={active} onSelect={setActive} />

            {/* Navegação desktop: sidebar vertical */}
            <div className="hidden rounded-3xl border border-border bg-card p-3 lg:block">
              {NAV_GROUPS.map((group) => (
                <div key={group} className="mb-4 last:mb-1">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                  {SECTIONS.filter((section) => section.group === group).map((s) => (
                    <button key={s.key} onClick={() => setActive(s.key)} className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active === s.key ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-muted"}`}>
                      <s.icon className="h-5 w-5 shrink-0" /><div><p className="text-sm font-semibold">{s.label}</p><p className={`text-xs ${active === s.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.desc}</p></div>
                    </button>
                  ))}
                </div>
              ))}
              <div className="mt-2 flex items-start gap-2 rounded-2xl border border-border bg-background p-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                Área protegida — apenas o e-mail cadastrado como administrador acessa este painel.
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <Current onNavigate={setActive} />
          </div>
        </div>
      </section>
    </div>
  );
}