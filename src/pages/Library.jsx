import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, BookOpen, FileText, Video, Headphones, ExternalLink, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";

const resources = [
  { type: "E-book", icon: BookOpen, title: "Matemática Básica — Volume 1", author: "Profa. Helena Castro", size: "4.2 MB", category: "Matemática", featured: true },
  { type: "Apostila", icon: FileText, title: "Português para Redação", author: "Profa. Mariana Dias", size: "6.8 MB", category: "Português", featured: true },
  { type: "Videoaula", icon: Video, title: "Introdução à Química Orgânica", author: "Prof. André Souza", size: "32 min", category: "Química", featured: false },
  { type: "E-book", icon: BookOpen, title: "História do Brasil Colonial", author: "Prof. Carlos Nunes", size: "5.1 MB", category: "História", featured: false },
  { type: "Áudio", icon: Headphones, title: "Inglês — Conversação Diária", author: "Profa. Sofia Mendes", size: "18 min", category: "Inglês", featured: false },
  { type: "Apostila", icon: FileText, title: "Física — Mecânica Clássica", author: "Prof. Ricardo Lima", size: "7.3 MB", category: "Física", featured: true },
  { type: "Videoaula", icon: Video, title: "Biologia Celular na Prática", author: "Profa. Beatriz Reis", size: "41 min", category: "Biologia", featured: false },
  { type: "E-book", icon: BookOpen, title: "Robótica Educacional", author: "Prof. Lucas Almeida", size: "3.9 MB", category: "Tecnologia", featured: false },
  { type: "Apostila", icon: FileText, title: "Geografia do Brasil", author: "Profa. Júlia Ferreira", size: "5.5 MB", category: "Geografia", featured: false },
  { type: "Videoaula", icon: Video, title: "Filosofia Moderna", author: "Prof. Rodrigo Batista", size: "27 min", category: "Filosofia", featured: false },
  { type: "E-book", icon: BookOpen, title: "Artes Visuais — Guia Completo", author: "Profa. Carla Pinto", size: "8.1 MB", category: "Artes", featured: false },
  { type: "Áudio", icon: Headphones, title: "Espanhol para Iniciantes", author: "Profa. Sofia Mendes", size: "22 min", category: "Idiomas", featured: false },
];

const usefulLinks = [
  { title: "Portal do Aluno", desc: "Notas, frequência e materiais", url: "#" },
  { title: "BNCC", desc: "Base Nacional Comum Curricular", url: "https://www.gov.br/mec/pt-br" },
  { title: "MEC", desc: "Ministério da Educação", url: "https://www.gov.br/mec/pt-br" },
  { title: "ENEM", desc: "Exame Nacional do Ensino Médio", url: "#" },
  { title: "Google Acadêmico", desc: "Pesquisa acadêmica gratuita", url: "https://scholar.google.com" },
  { title: "Domínio Público", desc: "Biblioteca digital gratuita", url: "https://www.dominiopublico.gov.br" },
];

const categories = ["Todos", "Matemática", "Português", "Física", "Química", "Biologia", "História", "Geografia", "Inglês", "Tecnologia", "Artes", "Filosofia", "Idiomas"];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Library() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Todos");

  const filtered = resources.filter((r) => {
    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase()) || r.author.toLowerCase().includes(query.toLowerCase());
    const matchesCat = cat === "Todos" || r.category === cat;
    return matchesQuery && matchesCat;
  });

  return (
    <div>
      <PageHero
        eyebrow="Biblioteca Digital"
        title="Conhecimento ao alcance de um clique"
        description="Mais de 50.000 títulos, e-books, apostilas, videoaulas e materiais de apoio disponíveis para download."
      />

      {/* Estatísticas */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { n: "50.000+", l: "Títulos no acervo" },
            { n: "1.200+", l: "Videoaulas" },
            { n: "800+", l: "Apostilas" },
            { n: "24/7", l: "Acesso online" },
          ].map((s, i) => (
            <motion.div key={s.l} custom={i} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
              <p className="heading-font text-3xl font-bold text-primary sm:text-4xl">{s.n}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pesquisa */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, autor..."
              className="w-full rounded-full border border-border bg-card py-3 pl-12 pr-4 text-sm outline-none ring-primary transition focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <motion.article
              key={r.title}
              custom={i}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="group flex gap-4 rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-xl"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary">
                <r.icon className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">{r.type}</span>
                  {r.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                </div>
                <h3 className="heading-font mt-1.5 font-semibold leading-snug group-hover:text-primary">{r.title}</h3>
                <p className="text-xs text-muted-foreground">{r.author}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{r.size}</span>
                  <button className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                    <Download className="h-3.5 w-3.5" /> Baixar
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">Nenhum material encontrado para sua busca.</p>
        )}
      </section>

      {/* Links úteis */}
      <section className="border-t border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Links Úteis" title="Recursos externos recomendados" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {usefulLinks.map((l, i) => (
              <motion.a
                key={l.title}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 transition hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <h3 className="font-semibold group-hover:text-primary">{l.title}</h3>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground transition group-hover:text-primary" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}