import { useEffect, useState } from "react";
import { ShieldX, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

// Permite o acesso aos e-mails cadastrados como administrador (Setting keys admin_email, admin_email_2, admin_email_3).
// Proteção extra: se nada foi configurado ainda, um usuário com role "admin" ainda entra para configurar.
const ADMIN_KEYS = ["admin_email", "admin_email_2", "admin_email_3"];

export default function AdminGuard({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated || !user) { setLoading(false); return; }
    (async () => {
      try {
        const rows = await base44.entities.Setting.list();
        const emails = rows
          .filter((r) => ADMIN_KEYS.includes(r.key))
          .map((r) => (r.value || "").toLowerCase().trim())
          .filter(Boolean);
        setAllowedEmails(emails);
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
  if (allowedEmails.length === 0 && user.role === "admin") return children;

  if (allowedEmails.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldX className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="heading-font mt-4 text-xl font-bold">Acesso não configurado</h2>
        <p className="mt-2 text-sm text-muted-foreground">Nenhum e-mail administrador foi definido ainda.</p>
      </div>
    );
  }

  if (!allowedEmails.includes(userEmail)) {
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