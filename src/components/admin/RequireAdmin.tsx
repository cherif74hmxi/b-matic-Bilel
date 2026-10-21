import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert, WifiOff } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";

// ============================================================================
//  RequireAdmin — garde des routes /admin/*
//  · non connecté      → /admin/login (puis retour à la page demandée)
//  · connecté non-admin → écran « Accès refusé »
// ============================================================================

export const AdminLoading = () => (
  <div className="min-h-[100dvh] flex items-center justify-center" role="status">
    <Loader2 className="w-8 h-8 text-neon-purple animate-spin" aria-hidden="true" />
    <span className="sr-only">Chargement…</span>
  </div>
);

const Panel = ({ children }: { children: ReactNode }) => (
  <div className="min-h-[100dvh] flex items-center justify-center px-4">
    <div className="w-full max-w-sm bg-gradient-card border-glow rounded-xl p-6 text-center glow-card">{children}</div>
  </div>
);

export const AccessDenied = () => {
  const { user, signOut } = useAdminSession();
  return (
    <Panel>
      <ShieldAlert className="w-10 h-10 text-neon-pink mx-auto mb-3" aria-hidden="true" />
      <h1 className="font-heading text-lg font-bold mb-2">Accès refusé</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Le compte <span className="text-foreground break-all">{user?.email}</span> n'a pas accès à l'administration.
      </p>
      <button type="button" onClick={() => void signOut()} className="btn-main w-full min-h-[44px]">
        Se déconnecter
      </button>
    </Panel>
  );
};

export const CheckError = () => {
  const { recheck, signOut } = useAdminSession();
  return (
    <Panel>
      <WifiOff className="w-10 h-10 text-neon-cyan mx-auto mb-3" aria-hidden="true" />
      <h1 className="font-heading text-lg font-bold mb-2">Vérification impossible</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Impossible de vérifier vos droits. Vérifiez votre connexion internet.
      </p>
      <div className="flex flex-col gap-3">
        <button type="button" onClick={recheck} className="btn-main w-full min-h-[44px]">
          Réessayer
        </button>
        <button type="button" onClick={() => void signOut()} className="btn-ghost w-full min-h-[44px]">
          Se déconnecter
        </button>
      </div>
    </Panel>
  );
};

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { status } = useAdminSession();
  const location = useLocation();

  if (status === "loading") return <AdminLoading />;
  if (status === "signedOut") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (status === "notAdmin") return <AccessDenied />;
  if (status === "error") return <CheckError />;
  return <>{children}</>;
};

export default RequireAdmin;
