import { Link } from "react-router-dom";
import {
  Car, Wrench, Truck, ShieldCheck, Clock, Sparkles, HandCoins,
  ArrowRight, Lightbulb,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import GiftIllustration from "@/components/GiftIllustration";
import { pareBriseAccueil, pareBriseCadeaux, pareBriseRayonKm } from "@/data/parebrise";
import AuroraBackground from "@/components/AuroraBackground";
import useSeo from "@/hooks/useSeo";
import heroBg from "@/assets/hero-bg.webp";
import { serviceCategories } from "@/data/services";

const money = (n: number) =>
  "€" + n.toLocaleString("fr-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// Promotions : réutilise la catégorie "promotions" de src/data/services.ts.
const promotions = serviceCategories.find((c) => c.id === "promotions")?.services ?? [];

const services = [
  {
    icon: Car,
    title: "Rachat",
    desc: "Nous reprenons votre véhicule toutes marques à un prix juste et transparent. Estimation rapide et paiement immédiat.",
    btn: "Vendre mon véhicule",
    to: "/reprise",
  },
  {
    icon: Wrench,
    title: "Mécanique",
    desc: "Entretien complet, réparation et diagnostic de votre véhicule par des professionnels expérimentés. Garage ouvert 24h/24.",
    btn: "Prendre rendez-vous",
    to: "/mecanique",
  },
  {
    icon: Truck,
    title: "Dépannage",
    desc: "Assistance rapide et remorquage 24h/24, 7j/7. Nous intervenons partout pour vous dépanner dans les plus brefs délais.",
    btn: "Nous contacter",
    to: "/contact",
  },
];

// Engagements FACTUELS uniquement (aucun faux témoignage ni note Google).
const engagements = [
  { icon: Clock, title: "Ouvert 24h/24", desc: "Un garage disponible à tout moment, dépannage 7j/7." },
  { icon: ShieldCheck, title: "Dossier assurance pris en charge", desc: "Pour le pare-brise, nous gérons les démarches avec votre assureur." },
  { icon: Car, title: "Intervention sur place", desc: `Pour le pare-brise, nous venons chez vous ou au travail, à Liège et jusqu'à ${pareBriseRayonKm} km autour.` },
  { icon: HandCoins, title: "Reprise toutes marques", desc: "Estimation rapide et paiement sur place, sans mauvaise surprise." },
];

const Index = () => {
  useSeo({
    title: "B MATIC — Garage automobile | Pare-brise, Mécanique, Dépannage",
    description:
      "B MATIC, votre garage automobile de confiance. Remplacement de pare-brise pris en charge par l'assurance, entretien et promotions, reprise de véhicules et dépannage 24h/24.",
  });

  return (
    <div>
      {/* ============================================================ Hero */}
      <section className="relative min-h-[88vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Garage automobile futuriste"
            className="parallax-hero w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <AuroraBackground />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24">
          <AnimatedSection>
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gradient-neon">Mécanique, pare-brise</span>
                <br />
                <span className="text-foreground">& services</span>
                <br />
                <span className="text-foreground">automobiles</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                B MATIC, votre garage automobile de confiance. Pare-brise pris en charge par
                l'assurance, entretien, reprise et dépannage 24h/24.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <NeonButton to="/mecanique">Prendre rendez-vous</NeonButton>
                <Link
                  to="/pare-brise"
                  className="btn-ghost animate-glow-pulse border-neon-cyan/50"
                >
                  Offre pare-brise <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 neon-line" />
      </section>

      {/* ===================================================== Promotions */}
      {promotions.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10 md:mb-14">
                <span className="inline-block text-neon-pink text-xs font-heading uppercase tracking-widest mb-3">
                  Offres du moment
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  <span className="text-gradient-neon">Nos promotions</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                  Tarifs fermes, pièces et main-d'œuvre comprises. Réservez en ligne en quelques clics.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {promotions.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 120}>
                  <div className="h-full flex flex-col bg-gradient-card rounded-xl p-6 border border-neon-pink/40 hover:shadow-[0_0_35px_hsl(320_80%_55%/0.25)] transition-all duration-500 hover:-translate-y-1">
                    <Sparkles className="w-7 h-7 text-neon-pink mb-4" />
                    <h3 className="font-heading text-lg font-bold mb-2">{p.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
                    <div className="font-heading text-3xl font-bold text-gradient-neon mb-5">{money(p.price)}</div>
                    <Link to={`/mecanique?service=${p.id}`} className="btn-main w-full">
                      Réserver cette offre
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ Mise en avant pare-brise */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto bg-gradient-card border-glow rounded-2xl p-6 sm:p-8 md:p-12 glow-card">
              <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
                <div>
                  <span className="inline-block text-neon-cyan text-xs font-heading uppercase tracking-widest mb-3">
                    {pareBriseAccueil.surtitre}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    <span className="text-gradient-neon">{pareBriseAccueil.titre}</span>
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{pareBriseAccueil.texte}</p>
                  <Link to={pareBriseAccueil.cta.to} className="btn-main btn-sparkle min-h-[48px] w-full sm:w-auto">
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {pareBriseAccueil.cta.label}
                  </Link>
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
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ======================================================= Services */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">
              <span className="text-gradient-neon">Nos services</span>
            </h2>
            <p className="text-muted-foreground text-center mb-12 md:mb-16 max-w-xl mx-auto">
              Un garage complet pour tous vos besoins automobiles.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 150}>
                <Link to={s.to} className="block h-full group">
                  <GlowCard className="flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-gradient-neon flex items-center justify-center mb-5">
                      <s.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-neon-cyan text-sm font-heading uppercase tracking-wider">
                      {s.btn}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </GlowCard>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================== Pourquoi B MATIC + Conseils */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
              <span className="text-gradient-neon">Pourquoi B MATIC</span>
            </h2>
          </AnimatedSection>

          {/* Bandeau confiance compact (engagements factuels) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
            {engagements.map((e, i) => (
              <AnimatedSection key={e.title} delay={i * 100}>
                <div className="h-full bg-gradient-card border-glow rounded-xl p-5 text-center">
                  <div className="w-11 h-11 rounded-full bg-primary/15 text-neon-cyan grid place-items-center mx-auto mb-3">
                    <e.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm font-bold mb-1.5">{e.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{e.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Teaser Conseils */}
          <AnimatedSection>
            <div className="max-w-3xl mx-auto bg-gradient-card border-glow rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <Lightbulb className="w-9 h-9 text-neon-cyan shrink-0" />
              <div className="flex-1">
                <h3 className="font-heading text-lg md:text-xl font-bold mb-1">Nos conseils auto</h3>
                <p className="text-muted-foreground text-sm">
                  Entretien, pare-brise, hiver, pneus, reprise… nos articles pratiques pour
                  prendre soin de votre véhicule.
                </p>
              </div>
              <NeonButton to="/conseils">Voir nos conseils</NeonButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
