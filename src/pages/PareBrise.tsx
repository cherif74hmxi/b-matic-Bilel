import { Phone, Check, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import InsurerMarquee from "@/components/InsurerMarquee";
import useSeo from "@/hooks/useSeo";
import {
  pareBriseAccroche,
  pareBriseTelephone,
  pareBriseAvantages,
  pareBriseCadeaux,
  pareBriseMentions,
} from "@/data/pareBrise";
import { assurancesIntro } from "@/data/assurances";

const PareBrise = () => {
  useSeo({
    title: "Pare-brise & Assurances — B MATIC",
    description:
      "Remplacement de pare-brise pris en charge par votre assurance : 0 € à payer avec la garantie bris de glace, cadeau offert, intervention sur place et dossier assurance géré par B MATIC.",
  });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* ----------------------------------------------------------- Hero */}
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="inline-block text-neon-cyan text-xs font-heading uppercase tracking-widest mb-4">
              Offre pare-brise
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
              <span className="text-gradient-neon">{pareBriseAccroche.titre}</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {pareBriseAccroche.sousTitre}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={pareBriseTelephone.href} className="btn-main">
                <Phone className="w-4 h-4" /> Appeler le {pareBriseTelephone.affichage}
              </a>
              <NeonButton to="/mecanique">Prendre rendez-vous</NeonButton>
            </div>
          </div>
        </AnimatedSection>

        {/* ------------------------------------------------- Mise en avant 0 € */}
        <AnimatedSection delay={100}>
          <GlowCard className="max-w-3xl mx-auto text-center mb-14 md:p-10">
            <div className="font-heading text-5xl md:text-6xl font-bold text-gradient-neon mb-3">
              0 €
            </div>
            <p className="text-foreground text-lg font-semibold mb-2">
              à payer avec votre assurance
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
              Pour un remplacement avec prise en charge bris de glace, le coût peut être
              intégralement couvert — selon votre contrat, la franchise éventuelle et l'accord
              de votre assureur.
            </p>
          </GlowCard>
        </AnimatedSection>

        {/* ----------------------------------------------------- Cadeaux */}
        <AnimatedSection delay={100}>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-3">
            <span className="text-gradient-neon">Votre cadeau offert</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8 max-w-xl mx-auto">
            Selon le remplacement effectué, repartez avec l'un de ces cadeaux.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-5">
            {pareBriseCadeaux.map((c, i) => (
              <AnimatedSection key={c.nom} delay={i * 100}>
                <div className="h-full bg-gradient-card border-glow rounded-xl p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-full aspect-square rounded-lg bg-background/40 grid place-items-center overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.nom}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <span className="font-semibold text-sm">{c.nom}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-muted-foreground text-xs text-center italic max-w-xl mx-auto mb-14">
            Cadeau offert selon le remplacement effectué — à confirmer avec le garage.
          </p>
        </AnimatedSection>

        {/* ----------------------------------------------------- Avantages */}
        <AnimatedSection delay={100}>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="text-gradient-neon">Vos avantages</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-14">
            {pareBriseAvantages.map((a) => (
              <div
                key={a.titre}
                className="flex gap-4 items-start bg-gradient-card border-glow rounded-xl p-5"
              >
                <span className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 text-neon-cyan grid place-items-center">
                  <Check className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-sm mb-1">{a.titre}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* --------------------------------------------- Assureurs partenaires */}
        <AnimatedSection delay={100}>
          <GlowCard className="max-w-4xl mx-auto mb-14 text-center md:p-10">
            <ShieldCheck className="w-8 h-8 text-neon-cyan mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-5">{assurancesIntro}</p>
            <InsurerMarquee />
            <p className="text-muted-foreground text-xs mt-6">
              … et d'autres assureurs. Indiquez-nous le vôtre, nous vérifions la prise en charge.
            </p>
          </GlowCard>
        </AnimatedSection>

        {/* --------------------------------------------------------- CTA final */}
        <AnimatedSection delay={100}>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Sparkles className="w-8 h-8 text-neon-pink mx-auto mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Un impact ou une fissure ?
            </h2>
            <p className="text-muted-foreground mb-7">
              Contactez-nous dès maintenant, nous nous occupons de tout — y compris du dossier
              avec votre assurance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={pareBriseTelephone.href} className="btn-main">
                <Phone className="w-4 h-4" /> {pareBriseTelephone.affichage}
              </a>
              <NeonButton to="/mecanique">Prendre rendez-vous</NeonButton>
            </div>
            <p className="text-muted-foreground text-xs mt-6 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Intervention sur place — zone à confirmer.
            </p>
          </div>
        </AnimatedSection>

        {/* --------------------------------------------- Mentions légales offre */}
        <AnimatedSection>
          <div className="max-w-3xl mx-auto border-t border-border pt-6">
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {pareBriseMentions.map((m, i) => (
                <span key={i} className="block mb-1">
                  * {m}
                </span>
              ))}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PareBrise;
