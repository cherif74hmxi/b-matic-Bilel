import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RDV_PATH } from "@/data/rdv";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { conseilsJsonLd } from "@/seo/schema";
import { conseils, tempsDeLecture } from "@/data/conseils";
import { faqItems, type FaqCategorie } from "@/data/faq";


const Conseils = () => {
  // Questions fréquentes regroupées par catégorie (ordre d'apparition conservé).
  const groupes = useMemo(() => {
    const map = new Map<FaqCategorie, typeof faqItems>();
    for (const item of faqItems) {
      const liste = map.get(item.categorie) ?? [];
      liste.push(item);
      map.set(item.categorie, liste);
    }
    return Array.from(map.entries());
  }, []);

  useSeo({ ...pagesSeo["/conseils"], jsonLd: conseilsJsonLd() });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* ------------------------------------------------------------ Hero */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Lightbulb className="w-9 h-9 text-neon-cyan mx-auto mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-neon">Nos conseils pare-brise</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Impact, remplacement, caméra, vitres, assurance… des articles pratiques
              pour savoir quoi faire quand votre vitrage est abîmé.
            </p>
          </div>
        </AnimatedSection>

        {/* -------------------------------------------------- Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {conseils.map((c, i) => (
            <AnimatedSection key={c.slug} delay={i * 100}>
              <Link to={`/conseils/${c.slug}`} className="block h-full group">
                <GlowCard className="flex flex-col h-full !p-0 overflow-hidden">
                  {/* Vignette : vraie photo si fournie, sinon dégradé néon + icône */}
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.titre}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[16/10] bg-gradient-neon grid place-items-center">
                      <c.icon className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <span className="text-neon-cyan text-xs font-heading uppercase tracking-widest mb-2">
                      {c.categorie} · {tempsDeLecture(c)} min
                    </span>
                    <h2 className="font-heading text-lg font-bold mb-2 text-foreground">
                      {c.titre}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                      {c.extrait}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-neon-cyan text-sm font-heading uppercase tracking-wider">
                      Lire l'article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </GlowCard>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* ------------------------------------------------ Questions fréquentes */}
        <AnimatedSection>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">
            <span className="text-gradient-neon">Questions fréquentes</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10 max-w-xl mx-auto">
            Pare-brise, assurance, délais, paiement… les réponses aux questions les
            plus courantes.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-10">
          {groupes.map(([categorie, items], gi) => (
            <AnimatedSection key={categorie} delay={gi * 60}>
              <h3 className="font-heading text-lg md:text-xl font-bold mb-3 text-neon-purple">
                {categorie}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, i) => (
                  <AccordionItem key={i} value={`${categorie}-${i}`}>
                    <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-foreground hover:no-underline hover:text-neon-cyan">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {item.reponse}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          ))}
        </div>

        {/* --------------------------------------------------------- CTA final */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mt-16">
            <p className="text-muted-foreground mb-6">
              Un impact, une fissure, une vitre cassée ? Notre équipe vous répond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <NeonButton to="/contact">Nous contacter</NeonButton>
              <NeonButton to={RDV_PATH}>Demander un devis</NeonButton>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Conseils;
