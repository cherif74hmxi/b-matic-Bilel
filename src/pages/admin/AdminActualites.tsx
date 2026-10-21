import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Newspaper, Plus, RefreshCw } from "lucide-react";
import useSeo from "@/hooks/useSeo";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { PostActionsMenu, PostStatusBadge } from "@/components/admin/PostActions";
import ViewsCount from "@/components/admin/ViewsCount";
import { useContentViews, type ContentViews } from "@/lib/contentViews";
import { listPosts, postImageUrl, type Post } from "@/lib/posts";

// ============================================================================
//  Liste des actualités (admin)
// ============================================================================

const PostCard = ({ post, views }: { post: Post; views: Map<string, ContentViews> | undefined }) => (
  <li className="min-w-0 flex gap-3 bg-gradient-card border border-border rounded-xl p-3">
    <Link to={`/admin/actualites/${post.id}`} className="flex flex-1 min-w-0 gap-3" aria-label={`Modifier ${post.title}`}>
      <div className="w-24 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {post.cover_path ? (
          <img src={postImageUrl(post.cover_path, true)} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <Newspaper className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-medium leading-snug line-clamp-2">{post.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {post.status === "published" && post.published_at
            ? `Publiée le ${format(new Date(post.published_at), "d MMM yyyy", { locale: fr })}`
            : `Modifiée le ${format(new Date(post.updated_at), "d MMM yyyy", { locale: fr })}`}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <PostStatusBadge status={post.status} />
          <ViewsCount all={views} id={post.id} isDraft={post.status === "draft"} />
        </div>
      </div>
    </Link>
    <PostActionsMenu post={post} />
  </li>
);

const AdminActualites = () => {
  useSeo({ title: "Actualités — Admin B MATIC" });
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: listPosts });
  // Compteur masqué tant que les vues ne sont pas disponibles (chargement, migration manquante).
  const views = useContentViews("actualites");

  return (
    <>
      <AdminPageHeader
        title="Actualités"
        subtitle="Articles du blog du garage."
        actions={
          <Link to="/admin/actualites/nouvelle" className="btn-main min-h-[48px] w-full sm:w-auto">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nouvelle actualité
          </Link>
        }
      />

      {posts.isError ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neon-pink/40 bg-neon-pink/5 p-4 text-sm">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neon-pink shrink-0" aria-hidden="true" />
            Chargement impossible.
          </span>
          <button type="button" onClick={() => void posts.refetch()} className="btn-ghost min-h-[44px] px-4">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Réessayer
          </button>
        </div>
      ) : posts.isLoading ? (
        <div className="grid gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-[104px] rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : posts.data && posts.data.length > 0 ? (
        <ul className="grid gap-3 lg:grid-cols-2">
          {posts.data.map((p) => (
            <PostCard key={p.id} post={p} views={views.data} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucune actualité pour le moment.</p>
        </div>
      )}
    </>
  );
};

export default AdminActualites;
