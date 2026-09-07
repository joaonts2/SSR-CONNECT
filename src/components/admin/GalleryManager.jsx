import { useEffect, useState } from "react";
import { Camera, Loader2, Trash2, Upload, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { adminList, adminCreate, adminDelete, adminUpdate } from "@/lib/adminApi";
import { Field, inputCls } from "@/components/admin/ui";
import { Image } from "@/components/ui/image";

// Gestão da galeria de fotos: envio, exibição/ocultação e remoção das fotos
// da escola que aparecem na página Galeria do site público.
export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [ok, setOk] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await adminList("GalleryImage"));
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setSaving(true);
    setOk(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await adminCreate("GalleryImage", { title: title.trim(), image_url: file_url, is_active: true });
      setTitle("");
      setFile(null);
      e.target.reset();
      setOk("Foto publicada na galeria do site!");
      load();
    } catch (err) {
      setOk("Erro ao enviar: " + (err?.message || "tente novamente."));
    }
    setSaving(false);
  };

  const toggle = async (item) => {
    setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, is_active: !x.is_active } : x)));
    try {
      await adminUpdate("GalleryImage", item.id, { is_active: !item.is_active });
    } catch (e) { load(); }
  };

  const remove = async (id) => {
    try {
      await adminDelete("GalleryImage", id);
      setItems((xs) => xs.filter((x) => x.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Camera className="h-5 w-5" /></span>
        <div>
          <h2 className="heading-font text-2xl font-bold">Galeria de fotos</h2>
          <p className="text-sm text-muted-foreground">Envie as fotos da escola — elas aparecem na página Galeria do site</p>
        </div>
      </div>

      {ok && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
          <CheckCircle2 className="h-4 w-4" /> {ok}
        </p>
      )}

      <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Título da foto">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Ex.: Feira de Ciências 2026" required />
          </Field>
          <Field label="Imagem">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={inputCls} required />
          </Field>
        </div>
        <button
          type="submit"
          disabled={saving || !file || !title.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-float transition hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {saving ? "Enviando..." : "Publicar foto"}
        </button>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma foto enviada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className={`overflow-hidden rounded-2xl border bg-card ${item.is_active ? "border-border" : "border-border opacity-60"}`}>
                <Image src={item.image_url} alt={item.title} className="aspect-square w-full" />
                <div className="p-3">
                  <p className="break-all text-xs font-semibold leading-snug">{item.title}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggle(item)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${item.is_active ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                    >
                      {item.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {item.is_active ? "Visível" : "Oculta"}
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Excluir"
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}