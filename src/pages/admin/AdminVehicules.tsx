import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Car, Plus, RefreshCw } from "lucide-react";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { VehicleActionsMenu, VehicleStatusBadge } from "@/components/admin/VehicleActions";
import ViewsCount from "@/components/admin/ViewsCount";
import { useContentViews, type ContentViews } from "@/lib/contentViews";
import {
  formatKm,
  formatPrice,
  listVehicles,
  photoUrl,
  thumbPath,
  VEHICLE_STATUS_LABELS,
  type VehicleListItem,
  type VehicleStatus,
} from "@/lib/vehicles";

// ============================================================================
//  Liste des véhicules (admin) — cartes mobile-first, filtre par statut
// ============================================================================

type Filter = "all" | VehicleStatus;
const FILTERS: Filter[] = ["all", "draft", "published", "sold"];
const filterLabel = (f: Filter) => (f === "all" ? "Tous" : `${VEHICLE_STATUS_LABELS[f]}s`);

const coverOf = (v: VehicleListItem) => {
  const cover = v.vehicle_photos.find((p) => p.is_cover) ?? v.vehicle_photos[0];
  return cover ? photoUrl(thumbPath(cover.storage_path)) : null;
};

const VehicleCard = ({ vehicle, views }: { vehicle: VehicleListItem; views: Map<string, ContentViews> | undefined }) => {
  const cover = coverOf(vehicle);
  const specs = [vehicle.year, formatKm(vehicle.mileage_km)].filter(Boolean).join(" · ");

  return (
    <li className="min-w-0 flex gap-3 bg-gradient-card border border-border rounded-xl p-3">
      <Link
        to={`/admin/vehicules/${vehicle.id}`}
        className="flex flex-1 min-w-0 gap-3"
        aria-label={`Modifier ${vehicle.title}`}
      >
        <div className="relative w-24 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {cover ? (
            <img src={cover} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <Car className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
          )}
          {vehicle.status === "sold" && (
            <span className="absolute inset-x-0 bottom-0 bg-neon-pink/90 text-white text-[10px] font-heading uppercase tracking-wider text-center py-0.5">
              Vendu
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="font-medium leading-snug line-clamp-2">{vehicle.title}</p>
          {specs && <p className="text-xs text-muted-foreground mt-0.5">{specs}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-sm font-semibold tabular-nums">{formatPrice(vehicle.price_eur)}</span>
            <VehicleStatusBadge status={vehicle.status} />
          </div>
          <ViewsCount all={views} id={vehicle.id} isDraft={vehicle.status === "draft"} className="mt-1" />
        </div>
      </Link>
      <VehicleActionsMenu vehicle={vehicle} photoCount={vehicle.vehicle_photos.length} />
    </li>
  );
};

const AdminVehicules = () => {
  useSeo({ title: "Véhicules — Admin B MATIC" });
  const [filter, setFilter] = useState<Filter>("all");
  const vehicles = useQuery({ queryKey: ["admin", "vehicles"], queryFn: listVehicles });
  // Compteur masqué tant que les vues ne sont pas disponibles (chargement, migration manquante).
  const views = useContentViews("vehicules");

  const all = vehicles.data ?? [];
  const count = (f: Filter) => (f === "all" ? all.length : all.filter((v) => v.status === f).length);
  const shown = filter === "all" ? all : all.filter((v) => v.status === filter);

  return (
    <>
      <AdminPageHeader
        title="Véhicules"
        subtitle="Annonces des véhicules à vendre."
        actions={
          <Link to="/admin/vehicules/nouveau" className="btn-main min-h-[48px] w-full sm:w-auto">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Ajouter un véhicule
          </Link>
        }
      />

      <div role="group" aria-label="Filtrer par statut" className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`shrink-0 min-h-[40px] px-4 rounded-full border text-sm transition-colors ${
              filter === f ? "border-neon-purple bg-neon-purple/15 text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {filterLabel(f)} <span className="tabular-nums opacity-70">({count(f)})</span>
          </button>
        ))}
      </div>

      {vehicles.isError ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-4 text-sm">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neon-pink shrink-0" aria-hidden="true" />
            Chargement impossible.
          </span>
          <button type="button" onClick={() => void vehicles.refetch()} className="btn-ghost min-h-[44px] px-4">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Réessayer
          </button>
        </div>
      ) : vehicles.isLoading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[104px] rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : shown.length > 0 ? (
        <ul className="grid gap-3 lg:grid-cols-2">
          {shown.map((v) => (
            <VehicleCard key={v.id} vehicle={v} views={views.data} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Car className="w-10 h-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {all.length === 0 ? "Aucun véhicule pour le moment." : "Aucun véhicule avec ce statut."}
          </p>
        </div>
      )}
    </>
  );
};

export default AdminVehicules;
