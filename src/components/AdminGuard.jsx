import { useEffect, useState } from "react";
import { ShieldX, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { amIAdmin } from "@/lib/adminApi";

// Permite o acesso apenas a quem o servidor confirma como administrador
// (role "admin" do sistema OU e-mail cadastrado em admin_email até admin_email_5).
// A checagem acontece no adminApi (service role) e retorna só um booleano,
// sem expor a lista de e-mails administradores ao cliente.
export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated || !user) { setLoading(false); return; }
    (async () => {
      try { setAllowed(await amIAdmin()); }
      catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [authChecked, isAuthenticated, user]);

  if (isLoadingAuth || !authChecked || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!allowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldX className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="heading-font mt-4 text-xl font-bold">Acesso restrito</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Este painel é exclusivo dos administradores. O seu e-mail ({user.email}) não tem permissão.
        </p>
      </div>
    );
  }

  return children;
}