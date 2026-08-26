import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, KeyRound, LogOut, Loader2, CheckCircle2, AlertCircle, Lock, User,
  BookOpen, Megaphone, AlertTriangle, Info, ClipboardList, ExternalLink,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import {
  getAluno, setAluno, clearAluno, loginAluno, changeAlunoPassword,
} from "@/lib/alunoAuth";
import { subjectsForCourse } from "@/lib/courses";
import { base44 } from "@/api/base44Client";

const inputCls = "w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none ring-primary transition focus:ring-2";

const fmtDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return d;
  }
};

export default function AlunoPortal() {
  const [session, setSession] = useState(getAluno());
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [ok, setOk] = useState(null);

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);

  const doLogin = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const aluno = await loginAluno(login, password);
      setAluno({
        id: aluno.id,
        name: aluno.name,
        login: aluno.login,
        turma: aluno.turma,
        course: aluno.course || "",
        mustChange: !aluno.password_changed,
      });
      setSession(getAluno());
      setLogin(""); setPassword("");
    } catch (err2) {
      setErr(err2.message);
    }
    setBusy(false);
  };

  const doChange = async (e) => {
    e.preventDefault();
    setErr(null); setOk(null);
    if (next.length < 6) { setErr("A nova senha deve ter ao menos 6 caracteres."); return; }
    if (next !== conf) { setErr("As senhas não conferem."); return; }
    setBusy(true);
    try {
      await changeAlunoPassword(session.id, cur, next);
      setOk("Senha alterada com sucesso!");
      setCur(""); setNext(""); setConf("");
      setSession((s) => ({ ...s, mustChange: false }));
    } catch (err2) {
      setErr(err2.message);
    }
    setBusy(false);
  };

  const logout = () => {
    clearAluno();
    setSession(null); setOk(null); setErr(null); setNotices([]);
  };

  // Carrega os avisos ativos e mantém apenas os da turma do aluno + os gerais (sem turma).
  useEffect(() => {
    if (!session) { setNotices([]); return; }
    let active = true;
    (async () => {
      setLoadingNotices(true);
      try {
        const all = await base44.entities.Notice.filter({ is_active: true }, "-date", 50);
        const turma = (session.turma || "").trim().toLowerCase();
        const visible = all.filter((n) => {
          const nt = (n.turma || "").trim().toLowerCase();
          return !nt || nt === turma;
        });
        if (active) setNotices(visible);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingNotices(false);
      }
    })();
    return () => { active = false; };
  }, [session]);

  const subjects = session ? subjectsForCourse(session.course) : [];

  return (
    <div>
      <PageHero eyebrow="Portal do Aluno" title="Acesse sua conta" description="Entre com o login e a senha que a escola entregou para você. Veja suas disciplinas e os avisos da sua turma." />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {!session ? (
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={doLogin} className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><GraduationCap className="h-6 w-6" /></span>
              <div>
                <h2 className="heading-font text-lg font-bold">Entrar</h2>
                <p className="text-xs text-muted-foreground">Use seu login e senha escolar</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" className={inputCls} required />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className={inputCls} required />
              </div>
            </div>

            {err && <p className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" /> {err}</p>}

            <button type="submit" disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Entrar
            </button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Saudação */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><GraduationCap className="h-6 w-6" /></span>
                  <div>
                    <h2 className="heading-font text-lg font-bold">Olá, {session.name}</h2>
                    <p className="text-xs text-muted-foreground">{session.turma || "Sem turma"} · {session.course || "Curso não definido"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{session.login}</p>
                  </div>
                </div>
                <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"><LogOut className="h-3.5 w-3.5" /> Sair</button>
              </div>

              {session.mustChange && (
                <p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" /> Recomendamos que você troque sua senha agora.
                </p>
              )}
            </div>

            {/* Acessar notas */}
            <a href="https://estudante.seduc.pi.gov.br/login" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-5 transition hover:scale-[1.01] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ClipboardList className="h-6 w-6" /></span>
                <div>
                  <h3 className="heading-font text-base font-bold">Notas e Boletim</h3>
                  <p className="text-xs text-muted-foreground">Acesse o portal do estudante da SEDUC-PI para ver suas notas</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
            </a>

            {/* Avisos da turma */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600"><Megaphone className="h-5 w-5" /></span>
                <div>
                  <h3 className="heading-font text-base font-bold">Avisos da turma {session.turma || ""}</h3>
                  <p className="text-xs text-muted-foreground">Comunicados oficiais e específicos para a sua turma</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {loadingNotices ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                ) : notices.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Nenhum aviso no momento.</p>
                ) : (
                  notices.map((n) => {
                    const urgent = n.priority === "urgente";
                    return (
                      <div key={n.id} className={`flex gap-3 rounded-2xl border p-4 ${urgent ? "border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10" : "border-border bg-background"}`}>
                        <span className={`mt-0.5 shrink-0 ${urgent ? "text-amber-500" : "text-primary"}`}>{urgent ? <AlertTriangle className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}</span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[11px] font-semibold uppercase ${urgent ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>{urgent ? "Urgente" : n.priority === "alta" ? "Alta" : "Aviso"}</span>
                            {n.date && <span className="text-[11px] text-muted-foreground">{fmtDate(n.date)}</span>}
                          </div>
                          <p className="mt-0.5 text-sm font-semibold">{n.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Minhas disciplinas */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></span>
                <div>
                  <h3 className="heading-font text-base font-bold">Minhas disciplinas</h3>
                  <p className="text-xs text-muted-foreground">{session.course || "Curso não definido"}{session.turma ? ` · ${session.turma}` : ""}</p>
                </div>
              </div>
              {subjects.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {subjects.map((s, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-background p-4 text-center">
                      <BookOpen className="mx-auto h-5 w-5 text-secondary" />
                      <p className="mt-2 text-sm font-medium leading-snug">{s}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex items-start gap-2 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Nenhum curso técnico vinculado à sua matrícula ainda. Procure a secretaria para confirmar seu curso.
                </div>
              )}
            </div>

            {/* Trocar senha */}
            <form onSubmit={doChange} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="heading-font text-base font-bold">Trocar minha senha</h3>
              <div className="mt-5 space-y-4">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Senha atual" className={inputCls} required />
                </div>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Nova senha (mín. 6 caracteres)" className={inputCls} required />
                </div>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="Confirmar nova senha" className={inputCls} required />
                </div>
              </div>

              {err && <p className="mt-4 flex items-center gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" /> {err}</p>}
              {ok && <p className="mt-4 flex items-center gap-2 text-sm text-secondary"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

              <button type="submit" disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Alterar senha
              </button>
            </form>
          </motion.div>
        )}
      </section>
    </div>
  );
}