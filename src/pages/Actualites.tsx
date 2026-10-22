import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper, RefreshCw } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import useSeo from "@/hooks/useSeo";
import { formatPostDate, postCoverUrl, listPublicPosts } from "@/lib/publicContent";
import { autoExcerpt } from "@/lib/contentModel";
import { actualitesSeo, actualitesTextes } from "@/data/actualites";

const Actualites = () => {
  useSeo(actualitesSeo);
  const query = useQuery({ queryKey: ["public", "posts"], queryFn: () => listPublicPosts(), staleTime: 60_000 });
  const posts = query.data ?? [];

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <AnimatedSection>
          <div className="max-w-2xl mb-8">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
              <span className="text-gradient-neon">{actualitesTextes.titre}</span>
            </h1>
            <p className="text-muted-foreground">{actualitesTextes.texte}</p>
          </div>
        </AnimatedSection>

        {query.isPending ? (
          <div className="grid sm:grid-cols-2 gap-5" aria-busy="true">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-gradient-card animate-pulse">
                <div className="aspect-[16/9] bg-muted rounded-t-2xl" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : query.isError && !query.data ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{actualitesTextes.erreur}</p>
            <button type="button" onClick={() => void query.refetch()} className="btn-ghost min-h-[44px]">
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> {actualitesTextes.reessayer}
            </button>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{actualitesTextes.vide}</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-5">
            {posts.map((post, i) => (
              <li key={post.id}>
                <Link
                  to={`/actualites/${post.slug}`}
                  className="group flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-card border border-border hover:border-neon-purple/60 hover:shadow-[0_0_25px_hsl(270_80%_60%/0.25)] transition-all"
                >
                  <div className="aspect-[16/9] bg-muted overflow-hidden">
                    {post.cover_path ? (
                      <img
                        src={postCoverUrl(post.cover_path, true)}
                        srcSet={`${postCoverUrl(post.cover_path, true)} 480w, ${postCoverUrl(post.cover_path)} 1920w`}
                        sizes="(min-width: 640px) 45vw, 100vw"
                        alt=""
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-neon grid place-items-center">
                        <Newspaper className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <time dateTime={post.published_at ?? post.created_at} className="text-xs text-muted-foreground">
                      {formatPostDate(post)}
                    </time>
                    <h2 className="font-heading text-lg font-semibold leading-snug mt-1.5">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.excerpt || autoExcerpt(post.content)}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-neon-cyan mt-auto pt-4">
                      {actualitesTextes.lire} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Actualites;
