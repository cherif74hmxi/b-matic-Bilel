import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import NeonButton from "@/components/NeonButton";
import useSeo from "@/hooks/useSeo";
import { findConseil } from "@/data/conseils";

const SITE_URL = "https://www.bmatic.be";

const ConseilDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const conseil = slug ? findConseil(slug) : undefined;

  // Données structurées Article (générées depuis la même source).
  const jsonLd = useMemo(
    () =>
      conseil
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: conseil.titre,
            description: conseil.extrait,
            articleBody: conseil.contenu.join("\n\n"),
            url: `${SITE_URL}/conseils/${conseil.slug}`,
            author: { "@type": "Organization", name: "B MATIC" },
            publisher: { "@type": "Organization", name: "B MATIC" },
          }
        : undefined,
    [conseil],
  );

  useSeo({
    title: conseil ? `${conseil.titre} — Conseils B MATIC` : "Conseil introuvable — B MATIC",
    description: conseil?.extrait,
    jsonLd,
  });

  // Slug inconnu : message clair + retour à la liste (pas de 404 générique).
  if (!conseil) {
    return (
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            <span className="text-gradient-neon">Conseil introuvable</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Cet article n'existe pas ou a été déplacé.
          </p>
          <NeonButton to="/conseils">Retour aux conseils</NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Link
              to="/conseils"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Tous les conseils
            </Link>

            {conseil.image ? (
              <img
                src={conseil.image}
                alt={conseil.titre}
                className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
              />
            ) : (
              <div className="w-full aspect-[16/9] bg-gradient-neon grid place-items-center rounded-2xl mb-8">
                <conseil.icon className="w-16 h-16 text-primary-foreground" />
              </div>
            )}

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
              <span className="text-gradient-neon">{conseil.titre}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="space-y-5 text-foreground/90 leading-relaxed">
              {conseil.contenu.map((paragraphe, i) => (
                <p key={i}>{paragraphe}</p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="border-t border-border mt-12 pt-8 text-center">
              <p className="text-muted-foreground mb-6">
                Besoin d'un coup de main sur votre véhicule ?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <NeonButton to="/contact">Nous contacter</NeonButton>
                <NeonButton to="/mecanique">Prendre rendez-vous</NeonButton>
              </div>
            </div>
          </AnimatedSection>
        </article>
      </div>
    </div>
  );
};

export default ConseilDetail;
