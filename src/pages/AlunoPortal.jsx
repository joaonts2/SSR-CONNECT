import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, KeyRound, LogOut, Loader2, CheckCircle2, AlertCircle, Lock, User } from "lucide-react";
import PageHero from "@/components/PageHero";
import {
  getAluno, setAluno, clearAluno, loginAluno, changeAlunoPassword,
} from "@/lib/alunoAuth";

const inputCls = "w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none ring-primary transition focus:ring-2";

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

  const logout = () => { clearAluno(); setSession(null); setOk(null); setErr(null); };

  return (
    <div>
      <PageHero eyebrow="Portal do Aluno" title="Acesse sua conta" description="Entre com o login e a senha que a escola entregou para você. Você pode trocar sua senha quando quiser." />

      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        {!session ? (
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={doLogin} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
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
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><GraduationCap className="h-6 w-6" /></span>
                  <div>
                    <h2 className="heading-font text-lg font-bold">Olá, {session.name}</h2>
                    <p className="text-xs text-muted-foreground">{session.turma} · login: {session.login}</p>
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

            <form onSubmit={doChange} className="rounded-3xl border border-border bg-card p-8 shadow-sm">
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