import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronDown, Clock, HandCoins, Home, Phone, ShieldCheck, Sparkles, type LucideIcon,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GiftIllustration from "@/components/GiftIllustration";
import HeroBackground from "@/components/HeroBackground";
import InsurerMarquee from "@/components/InsurerMarquee";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { accueilJsonLd } from "@/seo/schema";
import { legalInfo } from "@/data/legal";
import { assurancesIntro } from "@/data/assurances";
import { pareBriseCadeaux, pareBriseFaq, pareBriseHero, pareBriseMention } from "@/data/parebrise";
import {
  accueilArguments,
  accueilAssureurs,
  accueilCadeaux,
  accueilCtaFinal,
  accueilFaq,
  accueilHero,
} from "@/data/accueil";

// Textes : src/data/accueil.ts · offre, cadeaux, FAQ : src/data/parebrise.ts

const ICONS: Record<string, LucideIcon> = { HandCoins, ShieldCheck, Clock, Home };

/** Titre de section commun. */
const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
    <h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight">
      <span className="text-gradient-neon">{children}</span>
    </h2>
    {sub && <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed">{sub}</p>}
  </div>
);

/** Devis (action principale) + téléphone. */
const Ctas = ({ center = false }: { center?: boolean }) => (
  <div className={`flex flex-col sm:flex-row gap-3 ${center ? "justify-center" : ""}`}>
    <Link to={accueilHero.ctaPrincipal.to} className="btn-main btn-sparkle min-h-[52px] w-full sm:w-auto">
      <Sparkles className="w-4 h-4" aria-hidden="true" /> {accueilHero.ctaPrincipal.label}
    </Link>
    <a href={legalInfo.phoneHref} className="btn-ghost min-h-[52px] w-full sm:w-auto bg-background/70 backdrop-blur-sm">
      <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
    </a>
  </div>
);

const Index = () => {
  useSeo({ ...pagesSeo["/"], jsonLd: accueilJsonLd() });

  return (
    <div>
      {/* ============================================================ Hero */}
      {/* Mobile : hauteur réduite (svh) pour que les arguments affleurent dès l'arrivée. */}
      <section className="relative min-h-[80svh] md:min-h-[88vh] flex items-center overflow-hidden">
        <HeroBackground />

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-12 md:pb-16">
          <AnimatedSection>
            <div className="max-w-2xl">
              <span className="inline-block text-neon-cyan text-xs font-heading uppercase tracking-widest mb-4">
                {accueilHero.surtitre}
              </span>
              <h1 className="font-heading text-[2rem] leading-[1.15] sm:text-5xl md:text-6xl font-bold mb-5">
                <span className="text-foreground">{pareBriseHero.titre}</span>{" "}
                <span className="text-gradient-neon">{pareBriseHero.titreAccent}</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                {pareBriseHero.sousTitre}
              </p>
              <Ctas />
              <p className="text-xs text-muted-foreground mt-4">{accueilHero.reassurance}</p>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 neon-line" />
      </section>

      {/* ======================================================= Arguments */}
      <section className="py-10 md:py-16" aria-label="Pourquoi B MATIC">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
              {accueilArguments.map((a) => {
                const Icon = ICONS[a.icon];
                return (
                  <li key={a.titre} className="h-full bg-gradient-card border-glow rounded-xl p-4 md:p-5 text-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-neon text-primary-foreground grid place-items-center mx-auto mb-3">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-heading text-sm md:text-base font-bold mb-1.5">{a.titre}</h2>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{a.texte}</p>
                  </li>
                );
              })}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ========================================================= Cadeaux */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <SectionTitle sub={accueilCadeaux.texte}>{accueilCadeaux.titre}</SectionTitle>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto" aria-label="Cadeaux au choix">
              {pareBriseCadeaux.map((c) => (
                <li key={c.nom} className="gift-tile rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <GiftIllustration name={c.illustration} className="w-16 h-16 md:w-20 md:h-20" />
                  <span className="font-semibold text-sm leading-snug">{c.nom}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= Assureurs */}
      <section className="py-10 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <SectionTitle sub={accueilAssureurs.texte}>{accueilAssureurs.titre}</SectionTitle>
            <p className="text-center font-semibold mb-4">{assurancesIntro}</p>
            <div className="max-w-4xl mx-auto">
              <InsurerMarquee />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================= FAQ */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <SectionTitle>{accueilFaq.titre}</SectionTitle>
              <div className="space-y-2.5">
                {pareBriseFaq.map((q) => (
                  <details key={q.question} className="group rounded-xl border border-border bg-gradient-card">
                    <summary className="flex items-center justify-between gap-3 cursor-pointer list-none min-h-[52px] px-4 py-3 font-semibold text-sm [&::-webkit-details-marker]:hidden">
                      {q.question}
                      <ChevronDown className="w-4 h-4 shrink-0 text-neon-cyan transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">{q.reponse}</p>
                  </details>
                ))}
              </div>
              <p className="text-center mt-6">
                <Link to="/pare-brise" className="inline-flex items-center gap-1.5 min-h-11 text-neon-cyan text-sm font-heading uppercase tracking-wider">
                  {accueilFaq.lien} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= CTA final */}
      <section className="pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto bg-gradient-card border-glow glow-card rounded-2xl p-6 md:p-10 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">{accueilCtaFinal.titre}</h2>
              <p className="text-muted-foreground mb-7">{accueilCtaFinal.texte}</p>
              <Ctas center />
              <p className="text-[11px] leading-snug text-muted-foreground mt-6 text-left">* {pareBriseMention}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
