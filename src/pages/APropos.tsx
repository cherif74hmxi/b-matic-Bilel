import { Shield, Eye, Heart } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import mechanicBg from "@/assets/mechanic-bg.webp";
import { horaires } from "@/data/horaires";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";

const advantages = [
  { icon: Shield, title: "Professionnalisme", desc: "Une équipe qualifiée et expérimentée, dédiée à l'excellence automobile depuis des années." },
  { icon: Eye, title: "Transparence", desc: "Des tarifs clairs et honnêtes, sans surprise. Nous vous expliquons chaque intervention." },
  { icon: Heart, title: "Service client", desc: `Votre satisfaction est notre priorité. Centre ouvert ${horaires.centre.texte} ; dépannage 24h/24 pour les urgences.` },
];

const APropos = () => {
  useSeo({ ...pagesSeo["/a-propos"] });
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-6">
            <span className="text-gradient-neon">À propos</span> <span className="text-foreground">de B MATIC</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            B MATIC est un garage automobile spécialisé dans la reprise de véhicules, l'entretien mécanique et le dépannage. Notre mission : offrir un service irréprochable, transparent et accessible à tous. Centre ouvert {horaires.centre.detail} ; dépannage 24h/24.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="relative rounded-2xl overflow-hidden mb-20 max-w-4xl mx-auto border-glow">
            <img src={mechanicBg} alt="Garage B MATIC" className="w-full h-64 md:h-96 object-cover" width={1200} height={800} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((a, i) => (
            <AnimatedSection key={a.title} delay={i * 150}>
              <GlowCard className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-neon flex items-center justify-center mx-auto mb-4">
                  <a.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-3 text-foreground">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
              </GlowCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APropos;
