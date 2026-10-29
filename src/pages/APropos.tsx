import { Shield, Eye, Heart } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import { horaires } from "@/data/horaires";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";

const advantages = [
  { icon: Shield, title: "Vitrages homologués", desc: "Vitrages conformes à la norme européenne 43R, capteurs et caméras compris, pose garantie." },
  { icon: Eye, title: "Transparence", desc: "Devis écrit avant toute intervention. Nous gérons le dossier avec votre assureur, vous n'avancez rien." },
  { icon: Heart, title: "Disponibilité", desc: `Centre ouvert ${horaires.centre.texte}, et intervention à domicile ou au travail autour de Liège.` },
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
            B MATIC est un centre spécialisé dans le pare-brise et le vitrage automobile, installé à Ans. Réparation d'impact, remplacement de pare-brise, de vitres et de lunette arrière : au centre ou chez vous, avec la franchise offerte. Centre ouvert {horaires.centre.detail}.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="relative rounded-2xl overflow-hidden mb-20 max-w-4xl mx-auto border-glow">
            <picture>
              <source media="(max-width: 767px)" srcSet="/hero-garage-mobile.webp" type="image/webp" />
              <source srcSet="/hero-garage.webp" type="image/webp" />
              <img src="/hero-garage.jpg" alt="L'atelier B MATIC à Ans" className="w-full h-64 md:h-96 object-cover" width={1920} height={1072} loading="lazy" />
            </picture>
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
