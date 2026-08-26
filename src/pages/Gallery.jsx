import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X, Camera, Film } from "lucide-react";
import PageHero from "@/components/PageHero";

const albums = [
  { title: "Feira de Ciências 2025", count: 24, gradient: "from-blue-500 to-indigo-600" },
  { title: "Festa Junina 2026", count: 36, gradient: "from-emerald-500 to-teal-600" },
  { title: "Formatura Ensino Médio", count: 42, gradient: "from-amber-500 to-orange-600" },
  { title: "Olimpíadas do Conhecimento", count: 18, gradient: "from-sky-500 to-blue-600" },
  { title: "Intercâmbio Cultural", count: 28, gradient: "from-violet-500 to-purple-600" },
  { title: "Torneio Esportivo", count: 32, gradient: "from-rose-500 to-pink-600" },
  { title: "Inauguração Lab Maker", count: 15, gradient: "from-cyan-500 to-blue-600" },
  { title: "Apresentação Musical", count: 21, gradient: "from-emerald-500 to-green-600" },
];

const videos = [
  { title: "Tour pelo Campus do CETI", duration: "4:32", gradient: "from-blue-600 to-indigo-700" },
  { title: "Robótica em Ação", duration: "6:18", gradient: "from-emerald-600 to-teal-700" },
  { title: "Depoimentos de Ex-Alunos", duration: "8:45", gradient: "from-amber-600 to-orange-700" },
  { title: "Feira de Ciências — Bastidores", duration: "5:22", gradient: "from-sky-600 to-blue-700" },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Gallery() {
  const [activeAlbum, setActiveAlbum] = useState(null);

  return (
    <div>
      <PageHero
        eyebrow="Galeria"
        title="Momentos que contam histórias"
        description="Fotos e vídeos dos eventos, projetos e do dia a dia no CETI Sebastião Soares Ribeiro."
      />

      {/* Álbuns de fotos */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="heading-font text-2xl font-bold">Álbuns de Fotos</h2>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {albums.map((a, i) => (
            <motion.button
              key={a.title}
              custom={i}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              onClick={() => setActiveAlbum(a.title)}
              className="group relative overflow-hidden rounded-3xl border border-border text-left transition hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className={`flex aspect-[4/5] items-end bg-gradient-to-br ${a.gradient} p-5`}>
                <div className="text-white">
                  <h3 className="heading-font text-lg font-bold leading-snug">{a.title}</h3>
                  <p className="mt-1 text-xs opacity-90">{a.count} fotos</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Vídeos */}
      <section className="border-t border-border bg-card/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-secondary" />
            <h2 className="heading-font text-2xl font-bold">Vídeos</h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${v.gradient}`}>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition group-hover:scale-110">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">{v.duration}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold leading-snug group-hover:text-primary">{v.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de álbum */}
      {activeAlbum && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setActiveAlbum(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="heading-font text-xl font-bold">{activeAlbum}</h2>
              <button onClick={() => setActiveAlbum(null)} className="rounded-full p-2 transition hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className={`aspect-square rounded-2xl bg-gradient-to-br ${albums.find((a) => a.title === activeAlbum)?.gradient}`} />
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Visualizando prévia do álbum. As fotos completas estão disponíveis no portal do aluno.</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}