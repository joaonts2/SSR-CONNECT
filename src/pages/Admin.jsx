import { useState } from "react";
import { Newspaper, Megaphone, CalendarDays, MessageSquare, ShieldCheck, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import NewsManager from "@/components/admin/NewsManager";
import NoticeManager from "@/components/admin/NoticeManager";
import EventManager from "@/components/admin/EventManager";
import TestimonialManager from "@/components/admin/TestimonialManager";
import AdminAccessManager from "@/components/admin/AdminAccessManager";
import StudentManager from "@/components/admin/StudentManager";

const SECTIONS = [
  { key: "news", label: "Notícias", icon: Newspaper, desc: "Publicar e editar notícias", Component: NewsManager },
  { key: "notices", label: "Avisos", icon: Megaphone, desc: "Mural de avisos e comunicados", Component: NoticeManager },
  { key: "events", label: "Eventos", icon: CalendarDays, desc: "Calendário escolar e provas", Component: EventManager },
  { key: "students", label: "Alunos", icon: Users, desc: "Listas por turma e logins/senhas", Component: StudentManager },
  { key: "testimonials", label: "Depoimentos", icon: MessageSquare, desc: "Aprovar depoimentos da comunidade", Component: TestimonialManager },
  { key: "access", label: "Acesso", icon: ShieldCheck, desc: "Definir e-mail do administrador", Component: AdminAccessManager },
];

export default function Admin() {
  const [active, setActive] = useState("news");
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
            <div className="rounded-3xl border border-border bg-card p-3">
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
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              Área protegida — apenas o e-mail cadastrado como administrador acessa este painel. Defina o e-mail na seção "Acesso".
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