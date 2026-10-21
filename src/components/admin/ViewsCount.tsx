import { Eye } from "lucide-react";
import type { ContentViews } from "@/lib/contentViews";

const fmt = new Intl.NumberFormat("fr-BE");

/**
 * « 12 vues · 3 sur 30 j » : vues de la fiche publique, pour les cartes de liste admin.
 * Rien n'est affiché tant que les vues ne sont pas chargées (ou si la migration
 * SQL manque), ni pour un brouillon (pas de fiche publique).
 */
const ViewsCount = ({
  all,
  id,
  isDraft,
  className = "",
}: {
  all: Map<string, ContentViews> | undefined;
  id: string;
  isDraft: boolean;
  className?: string;
}) => {
  if (!all || isDraft) return null;
  const total = all.get(id)?.total ?? 0;
  const last30 = all.get(id)?.last30 ?? 0;
  return (
    <span className={`${className} inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums`} title="Vues de la fiche publique (comptées sans cookie)">
      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
      {fmt.format(total)} vue{total > 1 ? "s" : ""}
      {total > 0 && ` · ${fmt.format(last30)} sur 30 j`}
    </span>
  );
};

export default ViewsCount;
