import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import { deletePost, POST_STATUS_LABELS, postPublishBlocker, updatePost, type Post, type PostStatus } from "@/lib/posts";

// ============================================================================
//  Statut d'une actualité : badge + menu d'actions (publier, supprimer)
// ============================================================================

export const PostStatusBadge = ({ status }: { status: PostStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-heading uppercase tracking-wider ${
      status === "published" ? "border-neon-cyan/60 text-neon-cyan" : "border-border text-muted-foreground"
    }`}
  >
    {POST_STATUS_LABELS[status]}
  </span>
);

export const PostActionsMenu = ({
  post,
  showEdit = true,
  unsavedChanges = false,
  onDeleted,
}: {
  post: Post;
  showEdit?: boolean;
  /** Formulaire modifié mais pas enregistré : publier mettrait en ligne l'ancienne version. */
  unsavedChanges?: boolean;
  onDeleted?: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: PostStatus) => updatePost(post.id, { status }),
    onSuccess: (updated) => {
      toast.success(updated.status === "published" ? "Actualité publiée sur le site." : "Actualité repassée en brouillon.");
      // Statut seulement : le texte ou l'image peuvent être en cours d'enregistrement.
      queryClient.setQueryData<Post>(["admin", "post", updated.id], (old) =>
        old ? { ...old, status: updated.status, published_at: updated.published_at } : updated,
      );
      invalidate();
    },
    onError: () => toast.error("Impossible de modifier le statut."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post),
    onSuccess: () => {
      toast.success("Actualité supprimée.");
      // Quitter le formulaire d'abord : sinon sa requête rechargerait la ligne supprimée.
      onDeleted?.();
      queryClient.removeQueries({ queryKey: ["admin", "post", post.id] });
      invalidate();
    },
    onError: () => toast.error("Suppression impossible. Réessayez."),
  });

  const publish = () => {
    if (unsavedChanges) {
      toast.error("Enregistrez d'abord vos modifications, puis publiez.");
      return;
    }
    const blocker = postPublishBlocker(post);
    if (blocker) toast.error(blocker);
    else statusMutation.mutate("published");
  };

  const itemClass = "min-h-[44px] gap-3 text-sm cursor-pointer";

  return (
    <>
      {/* modal={false} : évite le bug Radix (pointer-events bloqués) avec l'AlertDialog. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
          aria-label={`Actions pour ${post.title}`}
          disabled={statusMutation.isPending || deleteMutation.isPending}
        >
          <MoreVertical className="w-5 h-5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {showEdit && (
            <DropdownMenuItem className={itemClass} onSelect={() => navigate(`/admin/actualites/${post.id}`)}>
              <Pencil className="w-4 h-4" aria-hidden="true" /> Modifier
            </DropdownMenuItem>
          )}
          {post.status === "draft" ? (
            <DropdownMenuItem className={itemClass} onSelect={publish}>
              <Eye className="w-4 h-4" aria-hidden="true" /> Publier
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className={itemClass} onSelect={() => statusMutation.mutate("draft")}>
              <EyeOff className="w-4 h-4" aria-hidden="true" /> Dépublier
            </DropdownMenuItem>
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
            <AlertDialogTitle>Supprimer cette actualité ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {post.title} » et son image seront supprimés définitivement. Pour la retirer du site sans la perdre, utilisez
              plutôt « Dépublier ».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[44px]">Annuler</AlertDialogCancel>
            <AlertDialogAction className="min-h-[44px] bg-neon-pink text-white hover:bg-neon-pink/90" onClick={() => deleteMutation.mutate()}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
