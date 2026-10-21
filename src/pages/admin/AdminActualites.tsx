import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

// Gestion des actualités : arrive à l'étape 3.5.
const AdminActualites = () => {
  useSeo({ title: "Actualités — Admin B MATIC" });

  return (
    <>
      <AdminPageHeader title="Actualités" />
      <p className="text-sm text-muted-foreground">La gestion des articles arrive bientôt.</p>
    </>
  );
};

export default AdminActualites;
