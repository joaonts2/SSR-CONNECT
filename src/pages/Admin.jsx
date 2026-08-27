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

const SECTIONS = [
  { key: "overview", label: "Início", icon: LayoutDashboard, desc: "Visão geral e edição centralizada", Component: AdminOverview },
  { key: "news", label: "Notícias", icon: Newspaper, desc: "Publicar e editar notícias", Component: NewsManager },
  { key: "notices", label: "Avisos", icon: Megaphone, desc: "Mural de avisos e comunicados", Component: NoticeManager },
  { key: "events", label: "Eventos", icon: CalendarDays, desc: "Calendário escolar e provas", Component: EventManager },
  { key: "students", label: "Alunos", icon: Users, desc: "Listas por turma e logins/senhas", Component: StudentManager },
  { key: "teachers", label: "Professores", icon: Users, desc: "Aprovar cadastros e definir turmas", Component: TeacherManager },
  { key: "menu", label: "Cardápio", icon: UtensilsCrossed, desc: "Almoço e lanche da semana", Component: MenuManager },
  { key: "testimonials", label: "Depoimentos", icon: MessageSquare, desc: "Aprovar depoimentos da comunidade", Component: TestimonialManager },
  { key: "contact", label: "Contato", icon: Phone, desc: "Textos e dados da página de contato", Component: ContactInfoManager },
  { key: "ticker", label: "Banner Avisos", icon: Radio, desc: "Frase do topo da página inicial", Component: TickerManager },
  { key: "access", label: "Acesso", icon: ShieldCheck, desc: "Definir e-mail do administrador", Component: AdminAccessManager },
];

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
            {/* Navegação mobile: barra horizontal fixa e rolável */}
            <div className="sticky top-16 z-30 -mx-4 mb-2 bg-background/80 px-4 py-2 backdrop-blur lg:hidden">
              <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active === s.key ? "bg-primary text-primary-foreground shadow-soft" : "border border-border bg-card text-muted-foreground"}`}
                  >
                    <s.icon className="h-4 w-4 shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navegação desktop: sidebar vertical */}
            <div className="hidden rounded-3xl border border-border bg-card p-3 lg:block">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active === s.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <s.icon className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className={`text-xs ${active === s.key ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.desc}</p>
                  </div>
                </button>
              ))}
              <div className="mt-2 flex items-start gap-2 rounded-2xl border border-border bg-background p-4 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                Área protegida — apenas o e-mail cadastrado como administrador acessa este painel.
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <Current />
          </div>
        </div>
      </section>
    </div>
  );
}