// ============================================================================
//  AdminApp — arbre de routes de l'espace admin (/admin/*)
// ----------------------------------------------------------------------------
//  Chargé en différé depuis App.tsx : ni supabase-js ni le code admin ne sont
//  téléchargés par les visiteurs du site public. Toutes les pages sont en
//  noindex. Hors du Layout public (pas de Header/Footer/bannière cookies).
// ============================================================================
import { Navigate, Route, Routes } from "react-router-dom";
import { useNoIndex } from "@/hooks/useSeo";
import { AdminSessionProvider } from "@/hooks/useAdminSession";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminVehicules from "./AdminVehicules";
import AdminVehiculeForm from "./AdminVehiculeForm";
import AdminActualites from "./AdminActualites";
import AdminActualiteForm from "./AdminActualiteForm";
import AdminAgenda from "./AdminAgenda";

const AdminApp = () => {
  useNoIndex();

  return (
    <AdminSessionProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="vehicules" element={<AdminVehicules />} />
          <Route path="vehicules/nouveau" element={<AdminVehiculeForm />} />
          <Route path="vehicules/:id" element={<AdminVehiculeForm />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="actualites" element={<AdminActualites />} />
          <Route path="actualites/nouvelle" element={<AdminActualiteForm />} />
          <Route path="actualites/:id" element={<AdminActualiteForm />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminSessionProvider>
  );
};

export default AdminApp;
