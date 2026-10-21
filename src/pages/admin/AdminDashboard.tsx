import { Link } from "react-router-dom";
import { Car, Newspaper } from "lucide-react";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

// Tableau de bord : les KPI arrivent à l'étape 3.2.
const AdminDashboard = () => {
  useSeo({ title: "Tableau de bord — Admin B MATIC" });

  return (
    <>
      <AdminPageHeader title="Tableau de bord" subtitle="Bienvenue dans l'espace d'administration B MATIC." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/vehicules"
          className="flex items-center gap-4 min-h-[72px] bg-gradient-card border-glow rounded-xl p-5 hover:glow-card transition-shadow"
        >
          <Car className="w-7 h-7 text-neon-cyan shrink-0" aria-hidden="true" />
          <div>
            <p className="font-heading text-sm uppercase tracking-wider">Véhicules</p>
            <p className="text-sm text-muted-foreground">Annonces des véhicules à vendre</p>
          </div>
        </Link>
        <Link
          to="/admin/actualites"
          className="flex items-center gap-4 min-h-[72px] bg-gradient-card border-glow rounded-xl p-5 hover:glow-card transition-shadow"
        >
          <Newspaper className="w-7 h-7 text-neon-pink shrink-0" aria-hidden="true" />
          <div>
            <p className="font-heading text-sm uppercase tracking-wider">Actualités</p>
            <p className="text-sm text-muted-foreground">Articles du blog du garage</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AdminDashboard;
