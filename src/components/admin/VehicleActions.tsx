import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, MoreVertical, Pencil, RotateCcw, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteVehicle,
  publishBlocker,
  updateVehicle,
  VEHICLE_STATUS_LABELS,
  type Vehicle,
  type VehicleStatus,
} from "@/lib/vehicles";

// ============================================================================
//  Statut d'un véhicule : badge + menu d'actions (publier, vendu, supprimer)
// ============================================================================

const badgeStyles: Record<VehicleStatus, string> = {
  draft: "border-border text-muted-foreground",
  published: "border-neon-cyan/60 text-neon-cyan",
  sold: "border-neon-pink/60 text-neon-pink bg-neon-pink/10",
};

export const VehicleStatusBadge = ({ status }: { status: VehicleStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-heading uppercase tracking-wider ${badgeStyles[status]}`}
  >
    {VEHICLE_STATUS_LABELS[status]}
  </span>
);

export function useVehicleStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VehicleStatus }) => updateVehicle(id, { status }),
    onSuccess: (vehicle) => {
      const messages: Record<VehicleStatus, string> = {
        draft: "Annonce repassée en brouillon (invisible sur le site).",
        published: "Annonce publiée sur le site.",
        sold: "Véhicule marqué comme vendu.",
      };
      toast.success(messages[vehicle.status]);
      queryClient.setQueryData(["admin", "vehicle", vehicle.id], vehicle);
      void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
    },
    onError: () => toast.error("Impossible de modifier le statut."),
  });
}

interface VehicleActionsMenuProps {
  vehicle: Vehicle;
  photoCount?: number;
  /** Afficher l'entrée « Modifier » (inutile sur la page d'édition). */
  showEdit?: boolean;
  /** Après suppression (ex. retour à la liste). */
  onDeleted?: () => void;
}

export const VehicleActionsMenu = ({ vehicle, photoCount, showEdit = true, onDeleted }: VehicleActionsMenuProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const statusMutation = useVehicleStatusMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteVehicle(vehicle.id),
    onSuccess: () => {
      toast.success("Véhicule supprimé.");
      queryClient.removeQueries({ queryKey: ["admin", "vehicle", vehicle.id] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
      onDeleted?.();
    },
    onError: () => toast.error("Suppression impossible. Réessayez."),
  });

  const setStatus = (status: VehicleStatus) => {
    if (status === "published") {
      const blocker = publishBlocker(vehicle, photoCount);
      if (blocker) {
        toast.error(blocker);
        return;
      }
    }
    statusMutation.mutate({ id: vehicle.id, status });
  };

  const itemClass = "min-h-[44px] gap-3 text-sm cursor-pointer";

  return (
    <>
      {/* modal={false} : évite le bug Radix (pointer-events bloqués sur <body>)
          quand une AlertDialog s'ouvre depuis un élément du menu. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
          aria-label={`Actions pour ${vehicle.title}`}
          disabled={statusMutation.isPending || deleteMutation.isPending}
        >
          <MoreVertical className="w-5 h-5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {showEdit && (
            <DropdownMenuItem className={itemClass} onSelect={() => navigate(`/admin/vehicules/${vehicle.id}`)}>
              <Pencil className="w-4 h-4" aria-hidden="true" /> Modifier
            </DropdownMenuItem>
          )}
          {vehicle.status === "draft" && (
            <DropdownMenuItem className={itemClass} onSelect={() => setStatus("published")}>
              <Eye className="w-4 h-4" aria-hidden="true" /> Publier
            </DropdownMenuItem>
          )}
          {vehicle.status === "published" && (
            <>
              <DropdownMenuItem className={itemClass} onSelect={() => setStatus("sold")}>
                <Tag className="w-4 h-4" aria-hidden="true" /> Marquer « Vendu »
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClass} onSelect={() => setStatus("draft")}>
                <EyeOff className="w-4 h-4" aria-hidden="true" /> Dépublier
              </DropdownMenuItem>
            </>
          )}
          {vehicle.status === "sold" && (
            <>
              <DropdownMenuItem className={itemClass} onSelect={() => setStatus("published")}>
                <RotateCcw className="w-4 h-4" aria-hidden="true" /> Remettre en vente
              </DropdownMenuItem>
              <DropdownMenuItem className={itemClass} onSelect={() => setStatus("draft")}>
                <EyeOff className="w-4 h-4" aria-hidden="true" /> Retirer du site
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className={`${itemClass} text-neon-pink focus:text-neon-pink`} onSelect={() => setConfirmDelete(true)}>
            <Trash2 className="w-4 h-4" aria-hidden="true" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce véhicule ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {vehicle.title} » et toutes ses photos seront supprimés définitivement. Pour simplement le retirer du
              site, utilisez plutôt « Dépublier ».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[44px]">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[44px] bg-neon-pink text-white hover:bg-neon-pink/90"
              onClick={() => deleteMutation.mutate()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
