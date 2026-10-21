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
import AdminActualites from "./AdminActualites";

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
          <Route path="actualites" element={<AdminActualites />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminSessionProvider>
  );
};

export default AdminApp;
