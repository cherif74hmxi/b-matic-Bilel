import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import NeonButton from "@/components/NeonButton";
import useSeo, { useNoIndex } from "@/hooks/useSeo";
import { formatPostDate, postCoverUrl, getPublicPost, paragraphs, resolveSlugRedirect } from "@/lib/publicContent";
import { autoExcerpt } from "@/lib/contentModel";
import { actualitesSeo, actualitesTextes } from "@/data/actualites";

const NoIndex = () => {
  useNoIndex();
  return null;
};

const ActualiteDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["public", "post", slug], queryFn: () => getPublicPost(slug) });
  const post = query.data ?? null;

  // Article absent : l'adresse a peut-être changé après publication → redirection.
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setNotFound(false);
    if (!query.isSuccess || query.data !== null) return;
    let cancelled = false;
    void resolveSlugRedirect("actualites", slug).then((target) => {
      if (cancelled) return;
      if (target && target !== slug) navigate(`/actualites/${target}`, { replace: true });
      else setNotFound(true);
    });
    return () => {
      cancelled = true;
    };
  }, [query.isSuccess, query.data, slug, navigate]);

  const description = post ? post.excerpt || autoExcerpt(post.content) : undefined;
  const jsonLd = useMemo(
    () =>
      post
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            articleBody: post.content,
            image: post.cover_path ? [postCoverUrl(post.cover_path)] : undefined,
            datePublished: post.published_at ?? post.created_at,
            dateModified: post.updated_at,
            url: `${window.location.origin}/actualites/${post.slug}`,
            author: { "@type": "Organization", name: "B MATIC" },
            publisher: { "@type": "Organization", name: "B MATIC" },
          }
        : undefined,
    [post, description],
  );
  useSeo({ title: post ? `${post.title} — Actualités B MATIC` : actualitesSeo.title, description: description ?? actualitesSeo.description, jsonLd });

  const back = (
    <Link to="/actualites" className="inline-flex items-center gap-1.5 min-h-[44px] text-sm text-muted-foreground hover:text-foreground mb-4">
      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {actualitesTextes.retour}
    </Link>
  );

  if (query.isError && !query.data) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center max-w-md">
        {back}
        <p className="text-muted-foreground my-6">{actualitesTextes.erreur}</p>
        <button type="button" onClick={() => void query.refetch()} className="btn-ghost min-h-[44px]">
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> {actualitesTextes.reessayer}
        </button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center max-w-md">
        <NoIndex />
        <h1 className="font-heading text-2xl font-bold mb-4">
          <span className="text-gradient-neon">{actualitesTextes.introuvable}</span>
        </h1>
        <NeonButton to="/actualites">{actualitesTextes.retour}</NeonButton>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-3xl animate-pulse" aria-busy="true">
        {back}
        <div className="aspect-[16/9] rounded-2xl bg-muted mb-8" />
        <div className="h-8 bg-muted rounded w-3/4 mb-4" />
        <div className="h-4 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <article className="container mx-auto px-4 max-w-3xl">
        {back}
        {post.cover_path && (
          <img
            src={postCoverUrl(post.cover_path)}
            srcSet={`${postCoverUrl(post.cover_path, true)} 480w, ${postCoverUrl(post.cover_path)} 1920w`}
            sizes="(min-width: 768px) 768px, 100vw"
            alt=""
            decoding="async"
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
          />
        )}
        <time dateTime={post.published_at ?? post.created_at} className="text-sm text-muted-foreground">
          {formatPostDate(post)}
        </time>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mt-2 mb-6">
          <span className="text-gradient-neon">{post.title}</span>
        </h1>
        <div className="space-y-5 text-foreground/90 leading-relaxed whitespace-pre-line">
          {paragraphs(post.content).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground mb-6">{actualitesTextes.ctaQuestion}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <NeonButton to="/contact">{actualitesTextes.ctaContact}</NeonButton>
            <NeonButton to="/vehicules">{actualitesTextes.ctaVehicules}</NeonButton>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ActualiteDetail;
