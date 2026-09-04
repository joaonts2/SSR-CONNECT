import { useState } from "react";
import { Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Importa a ficha dos alunos em PDF: envia o arquivo, extrai os nomes com IA
// e devolve a lista para revisão no campo "Nomes dos alunos".
export default function PdfNamesImport({ onExtracted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setError(null); setCount(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const res = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            students: {
              type: "array",
              items: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
            },
          },
          required: ["students"],
        },
      });
      if (res.status !== "success" || !res.output) throw new Error("Não foi possível ler o PDF.");
      const list = Array.isArray(res.output) ? res.output : res.output.students || [];
      const names = list.map((s) => (s.name || "").trim()).filter(Boolean);
      if (names.length === 0) throw new Error("Nenhum nome de aluno encontrado no PDF.");
      onExtracted(names);
      setCount(names.length);
    } catch (err) {
      setError(err.message || "Erro ao processar o PDF.");
    }
    setBusy(false);
  };

  return (
    <div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-3 text-sm transition hover:border-primary">
        {busy ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
        <span className="text-muted-foreground">{busy ? "Lendo a ficha..." : "Enviar ficha em PDF e extrair os nomes"}</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={busy} />
      </label>
      {count && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
          <CheckCircle2 className="h-3.5 w-3.5" /> {count} nomes extraídos — revise a lista abaixo.
        </p>
      )}
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}