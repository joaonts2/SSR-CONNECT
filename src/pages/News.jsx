import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ChevronRight, Megaphone, AlertTriangle, User } from "lucide-react";
import PageHero from "@/components/PageHero";

const allNews = [
  { tag: "Evento", date: "10 Ago 2026", title: "Feira de Ciências Prism 2026 abre inscrições", excerpt: "Alunos do Fundamental II e Médio já podem inscrever seus projetos até 20 de agosto. Premiação em parceria com universidades locais.", content: "A Feira de Ciências é o maior evento acadêmico do ano..." },
  { tag: "Acadêmico", date: "05 Ago 2026", title: "Resultados do Simulado ENEM foram publicados", excerpt: "Confira o desempenho geral e individual dos alunos no portal do aluno. Média da escola superou a nacional em 18%.", content: "Os resultados do simulado..." },
  { tag: "Comunidade", date: "01 Ago 2026", title: "Programa de Intercâmbio Cultural recebe novos parceiros", excerpt: "Três novas instituições internacionais firmam parceria com a Prism para intercâmbio de estudantes.", content: "O programa de intercâmbio..." },
  { tag: "Esporte", date: "28 Jul 2026", title: "Equipe de vôlei conquista título intercolegial", excerpt: "Nossos atletas trouxeram o troféu de campeão da Copa Intercolegial pela segunda vez consecutiva.", content: "A equipe de vôlei..." },
  { tag: "Cultural", date: "22 Jul 2026", title: "Apresentação musical marca encerramento do semestre", excerpt: "Coral e banda da escola realizaram apresentação gratuita para a comunidade no auditório.", content: "O coral da escola..." },
  { tag: "Acadêmico", date: "15 Jul 2026", title: "Alunos são aprovados em olimpíadas do conhecimento", excerpt: "Quatro estudantes classificados para a fase nacional da Olimpíada de Matemática e Biologia.", content: "Parabéns aos nossos alunos..." },
  { tag: "Comunidade", date: "08 Jul 2026", title: "Campanha de arrecadação solidária supera meta", excerpt: "Foram arrecadados mais de 2 toneladas de alimentos não perecíveis para instituições parceiras.", content: "A campanha solidária..." },
  { tag: "Tecnologia", date: "01 Jul 2026", title: "Novo laboratório Maker é inaugurado", excerpt: "Espaço com impressoras 3D, cortadora a laser e robótica abre para todos os níveis de ensino.", content: "O novo laboratório Maker..." },
];

const notices = [
  { type: "Aviso", text: "Reunião de pais do Ensino Médio — 12/08 às 19h no Auditório Principal." },
  { type: "Aviso", text: "Entrega de boletins do 3º bimestre a partir de 18/08." },
  { type: "Aviso", text: "Inscrições para o intercâmbio cultural abertas até 30/08." },
  { type: "Urgente", text: "Suspensão das aulas no dia 09/08 devido ao feriado municipal." },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] } }),
};

export default function News() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("Todas");
  const [selected, setSelected] = useState(null);

  const tags = ["Todas", ...new Set(allNews.map((n) => n.tag))];
  const filtered = allNews.filter((n) => {
    const matchesQuery = n.title.toLowerCase().includes(query.toLowerCase()) || n.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesTag = tag === "Todas" || n.tag === tag;
    return matchesQuery && matchesTag;
  });

  return (
    <div>
      <PageHero
        eyebrow="Notícias e Avisos"
        title="Fique por dentro de tudo"
        description="Comunicados oficiais, notícias e avisos importantes para a comunidade escolar."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Lista de notícias */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar notícia..."
                  className="w-full rounded-full border border-border bg-card py-3 pl-12 pr-4 text-sm outline-none ring-primary transition focus:ring-2"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      tag === t ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {filtered.map((n, i) => (
                <motion.article
                  key={n.title}
                  custom={i}
                  variants={fade}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
                  onClick={() => setSelected(n)}
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold uppercase tracking-wide text-secondary">{n.tag}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {n.date}</span>
                  </div>
                  <h2 className="heading-font mt-3 text-xl font-semibold leading-snug group-hover:text-primary">{n.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Ler mais <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.article>
              ))}
              {filtered.length === 0 && (
                <p className="mt-16 text-center text-sm text-muted-foreground">Nenhuma notícia encontrada.</p>
              )}
            </div>
          </div>

          {/* Mural de avisos */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="heading-font flex items-center gap-2 text-lg font-bold">
                <Megaphone className="h-5 w-5 text-primary" /> Mural de Avisos
              </h3>
              <div className="mt-5 space-y-4">
                {notices.map((n, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 ${
                      n.type === "Urgente"
                        ? "border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
                        : "border-border bg-background"
                    }`}
                  >
                    <span className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide ${n.type === "Urgente" ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>
                      {n.type === "Urgente" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Megaphone className="h-3.5 w-3.5" />} {n.type}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Modal de leitura */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-8 shadow-2xl scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">{selected.tag}</span>
            <h2 className="heading-font mt-4 text-2xl font-bold leading-tight">{selected.title}</h2>
            <p className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selected.date}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Equipe Prism</span>
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{selected.excerpt}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {selected.content} A Escola Prism se orgulha de manter a comunidade escolar sempre informada.
              Acesse o calendário escolar para conferir datas e detalhes, ou entre em contato com a secretaria
              para mais informações. Continuamos comprometidos com a transparência e a comunicação ativa com
              todos os membros da nossa comunidade educacional.
            </p>
            <button onClick={() => setSelected(null)} className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-105">
              Fechar
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}