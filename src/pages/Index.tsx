import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronDown, Clock, HandCoins, Home, Phone, ShieldCheck, type LucideIcon,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GiftGrid from "@/components/GiftGrid";
import HeroBackground from "@/components/HeroBackground";
import InsurerLogos from "@/components/InsurerLogos";
import MapEmbed from "@/components/MapEmbed";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { accueilJsonLd } from "@/seo/schema";
import { legalInfo } from "@/data/legal";
import { horaires } from "@/data/horaires";
import { assurancesIntro } from "@/data/assurances";
import { pareBriseFaq, pareBriseHero, pareBriseMention } from "@/data/parebrise";
import {
  accueilArguments,
  accueilAssureurs,
  accueilCadeaux,
  accueilCtaFinal,
  accueilFaq,
  accueilHero,
} from "@/data/accueil";

// Textes : src/data/accueil.ts · offre, cadeaux, FAQ : src/data/parebrise.ts
// Direction artistique : couleurs pleines (marine, gris), UN SEUL accent en
// dégradé B MATIC sur l'écran : le mot-clé du titre du hero.

const ICONS: Record<string, LucideIcon> = { HandCoins, ShieldCheck, Clock, Home };

/** Titre de section commun (sobre, sans dégradé). */
const SectionTitle = ({ children, sub, eyebrow }: { children: React.ReactNode; sub?: string; eyebrow?: string }) => (
  <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight">{children}</h2>
    {sub && <p className="text-muted-foreground text-[15px] md:text-base mt-4 leading-relaxed">{sub}</p>}
  </div>
);

/** Devis (action principale) + téléphone. */
const Ctas = ({ center = false, inverse = false }: { center?: boolean; inverse?: boolean }) => (
  <div className={`flex flex-col sm:flex-row gap-3 ${center ? "justify-center" : ""}`}>
    <Link
      to={accueilHero.ctaPrincipal.to}
      className={`btn-main min-h-[52px] w-full sm:w-auto ${inverse ? "!bg-white !text-primary hover:!bg-white/90 !px-4 sm:!px-6" : ""}`}
    >
      {accueilHero.ctaPrincipal.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
    <a
      href={legalInfo.phoneHref}
      className={`btn-ghost min-h-[52px] w-full sm:w-auto ${inverse ? "!bg-transparent !text-white !border-white/40 hover:!bg-white/10" : ""}`}
    >
      <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
    </a>
  </div>
);

const Index = () => {
  useSeo({ ...pagesSeo["/"], jsonLd: accueilJsonLd() });

  return (
    <div>
      {/* ============================================================ Hero */}
      <section className="relative min-h-[82svh] md:min-h-[86vh] flex items-center overflow-hidden border-b border-border">
        <HeroBackground />

        <div className="container mx-auto px-4 relative z-10 pt-28 pb-14 md:pb-20">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="eyebrow mb-5">{accueilHero.surtitre}</p>
              <h1 className="font-heading text-[1.7rem] leading-[1.2] sm:text-4xl lg:text-[2.6rem] font-bold mb-6 text-foreground">
                {pareBriseHero.titre}{" "}
                {/* Le seul accent en dégradé de la page. */}
                <span className="text-gradient-neon">{pareBriseHero.titreAccent}</span>{" "}
                {pareBriseHero.titreSuite}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                {pareBriseHero.sousTitre}
              </p>
              <Ctas />
              <p className="text-sm text-muted-foreground mt-5">{accueilHero.reassurance}</p>
              <a href="#mention-offre" className="inline-block text-xs text-muted-foreground underline underline-offset-2 mt-2">
                * Selon votre contrat et l'accord de votre assureur
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= Arguments */}
      <section className="py-14 md:py-20" aria-label="Pourquoi B MATIC">
        <div className="container mx-auto px-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 max-w-6xl mx-auto">
            {accueilArguments.map((a) => {
              const Icon = ICONS[a.icon];
              return (
                <li key={a.titre} className="border-t border-border pt-5">
                  <Icon className="w-6 h-6 text-foreground mb-4" strokeWidth={1.6} aria-hidden="true" />
                  <h2 className="font-semibold text-base mb-1.5">{a.titre}</h2>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">{a.texte}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ========================================================= Cadeaux */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <SectionTitle eyebrow="Offre pare-brise" sub={accueilCadeaux.texte}>
              {accueilCadeaux.titre}
            </SectionTitle>
            <div className="max-w-5xl mx-auto">
              <GiftGrid />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= Assureurs */}
      <section className="py-16 md:py-24 bg-muted/60 border-y border-border">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <SectionTitle sub={accueilAssureurs.texte}>{accueilAssureurs.titre}</SectionTitle>
            <p className="text-center font-semibold mb-5">{assurancesIntro}</p>
            <div className="max-w-4xl mx-auto">
              <InsurerLogos />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================= FAQ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <SectionTitle>{accueilFaq.titre}</SectionTitle>
              <div className="border-t border-border">
                {pareBriseFaq.map((q) => (
                  <details key={q.question} className="group border-b border-border">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none min-h-[56px] py-4 font-semibold text-[15px] [&::-webkit-details-marker]:hidden">
                      {q.question}
                      <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="pb-5 -mt-1 text-muted-foreground text-[15px] leading-relaxed">{q.reponse}</p>
                  </details>
                ))}
              </div>
              <p className="text-center mt-8">
                <Link to="/pare-brise" className="inline-flex items-center gap-1.5 min-h-11 font-semibold underline underline-offset-4 decoration-border hover:decoration-foreground">
                  {accueilFaq.lien} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================= Où nous trouver */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-center">
              <div>
                <p className="eyebrow mb-3">Le centre</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-4">À Ans, à deux pas de Liège</h2>
                <p className="text-[15px] leading-relaxed mb-2">{legalInfo.address}</p>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  Ouvert {horaires.centre.detail}. Intervention aussi à domicile ou au travail.
                </p>
              </div>
              <MapEmbed />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= CTA final */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-2xl px-4 py-10 sm:px-6 md:px-14 md:py-14 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">{accueilCtaFinal.titre}</h2>
              <p className="text-primary-foreground/75 mb-8 max-w-xl mx-auto">{accueilCtaFinal.texte}</p>
              <Ctas center inverse />
            </div>
            <p id="mention-offre" className="max-w-5xl mx-auto text-xs leading-relaxed text-muted-foreground mt-5">
              * {pareBriseMention}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
