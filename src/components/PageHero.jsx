import { motion } from "framer-motion";

// Cabeçalho de página interno (breadcrumb visual)
export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 prism-gradient opacity-80" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {eyebrow}
            </span>
          )}
          <h1 className="heading-font mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}