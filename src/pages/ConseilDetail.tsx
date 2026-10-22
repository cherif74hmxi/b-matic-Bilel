import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import NeonButton from "@/components/NeonButton";
import useSeo from "@/hooks/useSeo";
import { absoluteUrl } from "@/lib/site";
import { conseilsLies, conseilTexte, findConseil, tempsDeLecture, type ConseilBloc } from "@/data/conseils";
import logo from "@/assets/bmatic-logo.webp";

const dateLongue = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });

/** Affichage d'un bloc d'article (paragraphe, intertitre, liste, encadré). */
const Bloc = ({ bloc }: { bloc: ConseilBloc }) => {
  if (typeof bloc === "string") return <p>{bloc}</p>;
  if ("titre" in bloc) return <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground pt-4">{bloc.titre}</h2>;
  if ("liste" in bloc)
    return (
      <ul className="space-y-2.5 pl-1">
        {bloc.liste.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-neon-cyan shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  return (
    <aside className="flex gap-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-sm">
      <Info className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" aria-hidden="true" />
      <p>
        <strong className="text-neon-cyan">Bon à savoir : </strong>
        {bloc.aSavoir}
      </p>
    </aside>
  );
};

const ConseilDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const conseil = slug ? findConseil(slug) : undefined;

  // Données structurées Article + fil d'Ariane (générés depuis la même source).
  const jsonLd = useMemo(() => {
    if (!conseil) return undefined;
    const url = absoluteUrl(`/conseils/${conseil.slug}`);
    const texte = conseilTexte(conseil);
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `${url}#article`,
          headline: conseil.titre,
          description: conseil.extrait,
          articleSection: conseil.categorie,
          articleBody: texte,
          wordCount: texte.split(/\s+/).filter(Boolean).length,
          inLanguage: "fr-BE",
          datePublished: conseil.publie,
          dateModified: conseil.misAJour ?? conseil.publie,
          image: absoluteUrl(conseil.image ?? logo),
          mainEntityOfPage: url,
          url,
          author: { "@type": "Organization", name: "B MATIC", url: absoluteUrl("/") },
          publisher: {
            "@type": "Organization",
            name: "B MATIC",
            logo: { "@type": "ImageObject", url: absoluteUrl(logo) },
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Conseils", item: absoluteUrl("/conseils") },
            { "@type": "ListItem", position: 3, name: conseil.titre, item: url },
          ],
        },
      ],
    };
  }, [conseil]);

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

  const lies = conseilsLies(conseil.slug);
  const ctaInterne = conseil.cta.to.startsWith("/");

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto">
          <AnimatedSection>
            <Link
              to="/conseils"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Tous les conseils
            </Link>

            {conseil.image ? (
              <img
                src={conseil.image}
                alt=""
                className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
              />
            ) : (
              <div className="w-full aspect-[21/9] md:aspect-[16/6] bg-gradient-neon grid place-items-center rounded-2xl mb-8" aria-hidden="true">
                <conseil.icon className="w-14 h-14 md:w-16 md:h-16 text-primary-foreground" />
              </div>
            )}

            <p className="text-xs font-heading uppercase tracking-widest text-neon-cyan mb-3">{conseil.categorie}</p>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
              <span className="text-gradient-neon">{conseil.titre}</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              <time dateTime={conseil.misAJour ?? conseil.publie}>
                {conseil.misAJour ? `Mis à jour le ${dateLongue(conseil.misAJour)}` : `Publié le ${dateLongue(conseil.publie)}`}
              </time>{" "}
              · {tempsDeLecture(conseil)} min de lecture
            </p>
          </AnimatedSection>

          <div className="space-y-5 text-foreground/90 leading-relaxed">
            {conseil.contenu.map((bloc, i) => (
              <Bloc key={i} bloc={bloc} />
            ))}
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-muted-foreground mb-6">Besoin d'un coup de main sur votre véhicule ?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {ctaInterne ? (
                <NeonButton to={conseil.cta.to}>{conseil.cta.label}</NeonButton>
              ) : (
                <a href={conseil.cta.to} className="btn-main min-h-[48px]">
                  {conseil.cta.label}
                </a>
              )}
              <Link to="/contact" className="btn-ghost min-h-[48px]">
                Nous contacter
              </Link>
            </div>
          </div>
        </article>

        {/* ------------------------------------------------ À lire aussi */}
        {lies.length > 0 && (
          <section className="max-w-5xl mx-auto mt-16" aria-labelledby="a-lire-aussi">
            <h2 id="a-lire-aussi" className="font-heading text-xl md:text-2xl font-bold mb-6 text-center">
              <span className="text-gradient-neon">À lire aussi</span>
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {lies.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/conseils/${c.slug}`}
                    className="group flex md:flex-col gap-4 h-full bg-gradient-card border-glow rounded-xl p-4 hover:glow-card transition-shadow"
                  >
                    <span className="w-12 h-12 shrink-0 rounded-lg bg-gradient-neon grid place-items-center" aria-hidden="true">
                      <c.icon className="w-6 h-6 text-primary-foreground" />
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-heading uppercase tracking-widest text-neon-cyan">{c.categorie}</span>
                      <span className="font-heading text-sm font-bold leading-snug">{c.titre}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                        Lire <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ConseilDetail;
