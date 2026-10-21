import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

// Gestion des véhicules : arrive à l'étape 3.3.
const AdminVehicules = () => {
  useSeo({ title: "Véhicules — Admin B MATIC" });

  return (
    <>
      <AdminPageHeader title="Véhicules" />
      <p className="text-sm text-muted-foreground">La gestion des annonces arrive bientôt.</p>
    </>
  );
};

export default AdminVehicules;
