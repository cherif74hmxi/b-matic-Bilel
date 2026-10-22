import { Link } from "react-router-dom";
import {
  Car, Wrench, Truck, ShieldCheck, Clock, Sparkles, HandCoins,
  ArrowRight, Lightbulb, Phone, type LucideIcon,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import GiftIllustration from "@/components/GiftIllustration";
import { pareBriseAccueil, pareBriseCadeaux, pareBriseMention, pareBriseRayonKm } from "@/data/parebrise";
import HeroGarage from "@/components/HeroGarage";
import HomeLatest from "@/components/vehicules/HomeLatest";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { accueilJsonLd } from "@/seo/schema";
import { serviceCategories } from "@/data/services";
import { legalInfo } from "@/data/legal";
import {
  accueilConseils,
  accueilEngagements,
  accueilHero,
  accueilOffresFlash,
  accueilPromotions,
  accueilServices,
} from "@/data/accueil";

// Textes : src/data/accueil.ts · prix : src/data/services.ts · pare-brise : src/data/parebrise.ts

const ICONS: Record<string, LucideIcon> = { Car, Wrench, Truck, ShieldCheck, Clock, HandCoins };

const money = (n: number) =>
  "€" + n.toLocaleString("fr-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Promotions : réutilise la catégorie "promotions" de src/data/services.ts.
const promotions = serviceCategories.find((c) => c.id === "promotions")?.services ?? [];
const promoMin = promotions.length > 0 ? Math.min(...promotions.map((p) => p.price)) : null;

const engagements = accueilEngagements(pareBriseRayonKm);

const Index = () => {
  useSeo({ ...pagesSeo["/"], jsonLd: accueilJsonLd() });

  const offresFlash = accueilOffresFlash.filter((o) => !o.prixPromo || promoMin !== null);

  return (
    <div>
      {/* ============================================================ Hero */}
      {/* Mobile : hauteur réduite (svh, sans la barre d'adresse) pour que les
          offres apparaissent dès l'arrivée. */}
      <section className="relative min-h-[78svh] md:min-h-screen flex items-center overflow-hidden">
        {/* Fond : garage néon ; la voiture y rentre au défilement. */}
        <HeroGarage />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Mobile : espace réservé sous les boutons pour le garage et la voiture. */}
        <div className="container mx-auto px-4 relative z-10 pt-24 pb-44 md:pb-10">
          <AnimatedSection>
            <div className="max-w-2xl">
              <h1 className="font-heading text-[2.15rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 md:mb-6">
                <span className="text-gradient-neon">{accueilHero.titre[0]}</span>
                {accueilHero.titre.slice(1).map((l) => (
                  <span key={l}>
                    <br />
                    <span className="text-foreground">{l}</span>
                  </span>
                ))}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed max-w-lg">
                {accueilHero.texte}
              </p>

              {/* Offres mises en avant dès l'arrivée */}
              <ul className="flex flex-wrap gap-2 mb-7" aria-label="Offres du moment">
                {offresFlash.map((o) => {
                  const label = o.prixPromo ? `${o.label} dès ${money(promoMin as number)}` : o.label;
                  const className =
                    "inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full border border-neon-pink/50 bg-background/60 backdrop-blur-sm text-sm hover:border-neon-pink hover:bg-neon-pink/10 transition-colors";
                  return (
                    <li key={o.label}>
                      {o.to.startsWith("#") ? (
                        <a href={o.to} className={className}>
                          <Sparkles className="w-3.5 h-3.5 text-neon-pink shrink-0" aria-hidden="true" /> {label}
                        </a>
                      ) : (
                        <Link to={o.to} className={className}>
                          <Sparkles className="w-3.5 h-3.5 text-neon-pink shrink-0" aria-hidden="true" /> {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <NeonButton to={accueilHero.ctaPrincipal.to}>{accueilHero.ctaPrincipal.label}</NeonButton>
                <Link to={accueilHero.ctaSecondaire.to} className="btn-ghost animate-glow-pulse border-neon-cyan/50 bg-background/70 backdrop-blur-sm">
                  {accueilHero.ctaSecondaire.label} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 neon-line" />
      </section>

      {/* ============================================ Mise en avant pare-brise */}
      <section className="pt-10 pb-6 md:pt-16 md:pb-10">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto bg-gradient-card border-glow rounded-2xl p-5 sm:p-8 md:p-12 glow-card">
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 md:gap-8 items-center">
                <div>
                  <span className="inline-block text-neon-cyan text-xs font-heading uppercase tracking-widest mb-3">
                    {pareBriseAccueil.surtitre}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 md:mb-4 leading-tight">
                    <span className="text-gradient-neon">{pareBriseAccueil.titre}</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-5 md:mb-6">{pareBriseAccueil.texte}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={pareBriseAccueil.cta.to} className="btn-main btn-sparkle min-h-[48px] w-full sm:w-auto">
                      <Sparkles className="w-4 h-4" aria-hidden="true" /> {pareBriseAccueil.cta.label}
                    </Link>
                    <a href={legalInfo.phoneHref} className="btn-ghost min-h-[48px] w-full sm:w-auto">
                      <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
                    </a>
                  </div>
                </div>
                <ul className="grid grid-cols-4 gap-2" aria-label="Cadeaux au choix">
                  {pareBriseCadeaux.map((c) => (
                    <li key={c.nom} className="gift-tile aspect-square rounded-xl grid place-items-center p-1.5" title={c.nom}>
                      <GiftIllustration name={c.illustration} className="w-full h-full max-w-14" />
                      <span className="sr-only">{c.nom}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground mt-5 md:mt-6">{pareBriseMention}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== Promotions */}
      {promotions.length > 0 && (
        <section id="promotions" className="py-12 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-8 md:mb-14">
                <span className="inline-block text-neon-pink text-xs font-heading uppercase tracking-widest mb-3">
                  {accueilPromotions.surtitre}
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  <span className="text-gradient-neon">{accueilPromotions.titre}</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{accueilPromotions.texte}</p>
              </div>
            </AnimatedSection>

            {/* Mobile : carrousel horizontal (glisser), une offre et le début de
                la suivante visibles. À partir de md : grille de 3. */}
            <AnimatedSection>
              <ul
                className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 md:max-w-5xl overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:mx-auto md:px-0 pb-2 md:pb-0"
                aria-label="Promotions"
              >
                {promotions.map((p) => (
                  <li key={p.id} className="snap-start shrink-0 w-[85%] sm:w-[55%] md:w-auto">
                    <div className="h-full flex flex-col bg-gradient-card rounded-xl p-5 md:p-6 border border-neon-pink/40 hover:shadow-[0_0_35px_hsl(320_80%_55%/0.25)] transition-all duration-500 md:hover:-translate-y-1">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <Sparkles className="w-7 h-7 text-neon-pink" aria-hidden="true" />
                        <span className="text-[11px] font-heading uppercase tracking-wider text-neon-pink border border-neon-pink/40 rounded-full px-2.5 py-1">
                          {accueilPromotions.badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold mb-2">{p.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
                      <div className="font-heading text-3xl font-bold text-gradient-neon mb-5">{money(p.price)}</div>
                      <Link to={`/mecanique?service=${p.id}`} className="btn-main w-full min-h-[48px]">
                        {accueilPromotions.cta}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ======================================================= Services */}
      <section id="services" className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-gradient-neon">{accueilServices.titre}</span>
            </h2>
            <p className="text-muted-foreground text-center mb-10 md:mb-16 max-w-xl mx-auto">{accueilServices.texte}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {accueilServices.liste.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <AnimatedSection key={s.title} delay={i * 150}>
                  <Link to={s.to} className="block h-full group">
                    {/* Mobile : carte compacte (icône à gauche) ; md : carte centrée */}
                    <GlowCard className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-0 text-left md:text-center h-full">
                      <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-gradient-neon flex items-center justify-center md:mb-5">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col h-full md:items-center">
                        <h3 className="font-heading text-lg md:text-xl font-semibold mb-2 md:mb-3 text-foreground">{s.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 md:mb-5 flex-1">{s.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-neon-cyan text-sm font-heading uppercase tracking-wider">
                          {s.btn}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </div>
                    </GlowCard>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================== Derniers véhicules + actualités (si existants) */}
      <HomeLatest />

      {/* ======================================== Pourquoi B MATIC + Conseils */}
      <section className="py-12 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
              <span className="text-gradient-neon">Pourquoi B MATIC</span>
            </h2>
          </AnimatedSection>

          {/* Bandeau confiance compact (engagements factuels) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto mb-10 md:mb-12">
            {engagements.map((e, i) => {
              const Icon = ICONS[e.icon];
              return (
                <AnimatedSection key={e.title} delay={i * 100}>
                  <div className="h-full bg-gradient-card border-glow rounded-xl p-4 md:p-5 text-center">
                    <div className="w-11 h-11 rounded-full bg-primary/15 text-neon-cyan grid place-items-center mx-auto mb-3">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-sm font-bold mb-1.5">{e.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{e.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Teaser Conseils */}
          <AnimatedSection>
            <div className="max-w-3xl mx-auto bg-gradient-card border-glow rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <Lightbulb className="w-9 h-9 text-neon-cyan shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h3 className="font-heading text-lg md:text-xl font-bold mb-1">{accueilConseils.titre}</h3>
                <p className="text-muted-foreground text-sm">{accueilConseils.texte}</p>
              </div>
              <NeonButton to="/conseils">{accueilConseils.cta}</NeonButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
