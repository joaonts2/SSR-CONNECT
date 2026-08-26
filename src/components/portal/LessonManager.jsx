import { useEffect, useState, useCallback } from "react";
import { Video, Link as LinkIcon, Plus, Loader2, Trash2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Gerenciador de aulas para o professor: posta vídeo-aulas e links, direcionados
// a uma turma, com listagem e remoção dos próprios posts.
export default function LessonManager({ turmas, author }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", type: "Vídeo", url: "", turma: turmas?.[0] || "", discipline: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await base44.entities.Lesson.list("-date", 200);
      setLessons(all.filter((l) => !author || l.author === author));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [author]);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      const rec = await base44.entities.Lesson.create({
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        url: form.url.trim(),
        turma: form.turma,
        discipline: form.discipline.trim(),
        author: author || "Professor",
        date: new Date().toISOString().slice(0, 10),
        is_active: true,
      });
      setLessons((l) => [rec, ...l]);
      setForm({ title: "", description: "", type: "Vídeo", url: "", turma: turmas?.[0] || "", discipline: "" });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const remove = async (id) => {
    try { await base44.entities.Lesson.delete(id); setLessons((l) => l.filter((x) => x.id !== id)); } catch (e) { console.error(e); }
  };

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-primary transition focus:ring-2";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Video className="h-5 w-5" /></span>
        <div>
          <h3 className="heading-font text-base font-bold">Vídeo-aulas e links</h3>
          <p className="text-xs text-muted-foreground">Compartilhe conteúdo com seus alunos por turma</p>
        </div>
      </div>

      <form onSubmit={create} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da aula" className={inputCls} required />
          <select value={form.turma} onChange={(e) => setForm({ ...form, turma: e.target.value })} className={inputCls}>
            <option value="">Todas as turmas</option>
            {(turmas || []).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
            <option value="Vídeo">Vídeo-aula</option>
            <option value="Link">Link externo</option>
          </select>
          <input value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })} placeholder="Disciplina (opcional)" className={inputCls} />
        </div>
        <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="Link do vídeo (YouTube) ou URL" className={inputCls} required />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição / orientações (opcional)" rows={2} className={inputCls} />
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Publicar
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : lessons.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Você ainda não publicou aulas.</p>
        ) : lessons.map((l) => (
          <div key={l.id} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${l.type === "Vídeo" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
              {l.type === "Vídeo" ? <Video className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{l.title}</p>
              <p className="text-[11px] text-muted-foreground">{l.turma || "Todas as turmas"}{l.discipline ? ` · ${l.discipline}` : ""}</p>
              {l.description && <p className="mt-1 text-xs text-muted-foreground">{l.description}</p>}
              <a href={l.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"><ExternalLink className="h-3 w-3" /> Abrir</a>
            </div>
            <button onClick={() => remove(l.id)} aria-label="Remover" className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}