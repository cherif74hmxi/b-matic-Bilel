import { NavLink, Link, Outlet } from "react-router-dom";
import { CalendarDays, ExternalLink, LayoutDashboard, LogOut, Newspaper } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/bmatic-logo.webp";
import { useAdminSession } from "@/hooks/useAdminSession";
import { guardLinkClick, confirmLeave } from "@/lib/unsavedChanges";

// ============================================================================
//  AdminLayout — coquille de l'espace admin (mobile-first)
//  · mobile  : barre du haut (logo + voir le site) + barre d'onglets en bas
//  · ≥ md    : barre latérale fixe à gauche
//  Cibles tactiles ≥ 44px, zone sûre iOS prise en compte.
// ============================================================================

const navItems = [
  { to: "/admin", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard, end: true },
  { to: "/admin/agenda", label: "Agenda", short: "Agenda", icon: CalendarDays, end: false },
  { to: "/admin/actualites", label: "Actualités", short: "Actus", icon: Newspaper, end: false },
];

const AdminLayout = () => {
  const { user, signOut } = useAdminSession();
  // Pas de navigate() ici : RequireAdmin redirige vers /admin/login dès que la session disparaît.
  const handleSignOut = async () => {
    if (!confirmLeave()) return;
    if (!(await signOut())) {
      toast.error("Déconnexion impossible : vérifiez votre connexion internet puis réessayez.");
    }
  };

  const sideItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 min-h-[44px] px-4 rounded-lg text-sm transition-colors ${
      isActive ? "bg-muted text-foreground border-glow" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
    }`;

  const tabItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] px-0.5 text-[10px] font-heading uppercase tracking-wide transition-colors ${
      isActive ? "text-neon-cyan" : "text-muted-foreground"
    }`;

  return (
    <div className="min-h-[100dvh] font-body">
      {/* ---------- Barre latérale (≥ md) ---------- */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-card/60 border-r border-border p-4">
        <Link to="/admin" className="flex items-center gap-2 px-2 mb-8" onClick={guardLinkClick}>
          <img src={logo} alt="B MATIC" className="h-10 w-auto rounded" />
          <span className="font-heading text-xs uppercase tracking-widest text-primary">Admin</span>
        </Link>
        <nav aria-label="Navigation admin" className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={sideItemClass} onClick={guardLinkClick}>
              <Icon className="w-5 h-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-border">
          <p className="px-4 pb-2 text-xs text-muted-foreground truncate" title={user?.email}>
            {user?.email}
          </p>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 min-h-[44px] px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60"
          >
            <ExternalLink className="w-5 h-5" aria-hidden="true" />
            Voir le site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 min-h-[44px] px-4 rounded-lg text-sm text-muted-foreground hover:text-neon-pink hover:bg-muted/60"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ---------- Barre du haut (mobile) ---------- */}
      <header
        className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 min-h-[56px] bg-background/95 backdrop-blur-xl border-b border-border"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link to="/admin" className="flex items-center gap-2" onClick={guardLinkClick}>
          <img src={logo} alt="B MATIC" className="h-10 w-auto rounded" />
          <span className="font-heading text-[11px] uppercase tracking-widest text-primary">Admin</span>
        </Link>
        <Link
          to="/"
          target="_blank"
          aria-label="Voir le site"
          className="flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="w-5 h-5" aria-hidden="true" />
        </Link>
      </header>

      {/* ---------- Contenu ---------- */}
      <main className="md:pl-64 pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* ---------- Onglets du bas (mobile) ---------- */}
      <nav
        aria-label="Navigation admin"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-background/95 backdrop-blur-xl border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map(({ to, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={tabItemClass} onClick={guardLinkClick}>
            <Icon className="w-5 h-5" aria-hidden="true" />
            {short}
          </NavLink>
        ))}
        <button type="button" onClick={handleSignOut} className={tabItemClass({ isActive: false })}>
          <LogOut className="w-5 h-5" aria-hidden="true" />
          Quitter
        </button>
      </nav>
    </div>
  );
};

export default AdminLayout;
