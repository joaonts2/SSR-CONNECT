import { useEffect, useState } from "react";
import { ShieldX, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

// Permite o acesso apenas ao e-mail cadastrado como administrador (Setting key="admin_email").
// Proteção extra: se nada foi configurado ainda, um usuário com role "admin" ainda entra para configurar.
export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [allowedEmail, setAllowedEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated || !user) { setLoading(false); return; }
    (async () => {
      try {
        const rows = await base44.entities.Setting.filter({ key: "admin_email" });
        setAllowedEmail((rows[0]?.value || "").toLowerCase().trim());
      } catch (e) { console.error(e); }
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

  const userEmail = (user.email || "").toLowerCase().trim();

  // Bootstrap: se nenhum e-mail administrador foi definido, um admin do sistema configura.
  if (!allowedEmail && user.role === "admin") return children;

  if (!allowedEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldX className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="heading-font mt-4 text-xl font-bold">Acesso não configurado</h2>
        <p className="mt-2 text-sm text-muted-foreground">Nenhum e-mail administrador foi definido ainda.</p>
      </div>
    );
  }

  if (userEmail !== allowedEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldX className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="heading-font mt-4 text-xl font-bold">Acesso restrito</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Este painel é exclusivo do administrador. O seu e-mail ({user.email}) não tem permissão.
        </p>
      </div>
    );
  }

  return children;
}