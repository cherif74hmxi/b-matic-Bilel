import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import VehicleCard from "@/components/vehicules/VehicleCard";
import { formatPostDate, listPublicPosts, listPublicVehicles } from "@/lib/publicContent";
import { accueilDerniers } from "@/data/occasions";

// ============================================================================
//  Accueil : derniers véhicules en vente (3) + dernières actualités (2)
//  Chaque bloc disparaît s'il est vide ou si Supabase ne répond pas : jamais
//  de section vide ni de message d'erreur sur la page d'accueil.
// ============================================================================

const SeeAll = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="inline-flex items-center gap-1.5 min-h-[44px] text-sm text-neon-cyan font-heading uppercase tracking-wider group">
    {children} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
  </Link>
);

const HomeLatest = () => {
  const vehicles = useQuery({ queryKey: ["public", "vehicles", "home"], queryFn: () => listPublicVehicles({ availableOnly: true, limit: 3 }), staleTime: 60_000 });
  const posts = useQuery({ queryKey: ["public", "posts", "home"], queryFn: () => listPublicPosts(2), staleTime: 60_000 });

  const available = vehicles.data ?? [];
  const latestPosts = posts.data ?? [];
  if (available.length === 0 && latestPosts.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-14">
        {available.length > 0 && (
          <div>
            <AnimatedSection>
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
                <h2 className="font-heading text-2xl md:text-4xl font-bold">
                  <span className="text-gradient-neon">{accueilDerniers.vehiculesTitre}</span>
                </h2>
                <SeeAll to="/vehicules">{accueilDerniers.vehiculesLien}</SeeAll>
              </div>
            </AnimatedSection>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {available.map((v) => (
                <li key={v.id}>
                  <VehicleCard vehicle={v} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {latestPosts.length > 0 && (
          <div>
            <AnimatedSection>
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
                <h2 className="font-heading text-2xl md:text-3xl font-bold">
                  <span className="text-gradient-neon">{accueilDerniers.actusTitre}</span>
                </h2>
                <SeeAll to="/actualites">{accueilDerniers.actusLien}</SeeAll>
              </div>
            </AnimatedSection>
            <ul className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {latestPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/actualites/${p.slug}`}
                    className="flex flex-col h-full rounded-2xl bg-gradient-card border border-border hover:border-neon-purple/60 transition-colors p-5"
                  >
                    <time dateTime={p.published_at ?? p.created_at} className="text-xs text-muted-foreground">
                      {formatPostDate(p)}
                    </time>
                    <h3 className="font-heading font-semibold leading-snug mt-1.5">{p.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeLatest;
