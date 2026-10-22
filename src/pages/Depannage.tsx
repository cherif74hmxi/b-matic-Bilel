import { Phone, MapPin, Clock, Truck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import NeonButton from "@/components/NeonButton";
import { legalInfo } from "@/data/legal";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { depannageJsonLd } from "@/seo/schema";

const Depannage = () => {
  useSeo({ ...pagesSeo["/depannage"], jsonLd: depannageJsonLd() });
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Service de <span className="text-primary">Dépannage</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              En panne ? B MATIC intervient rapidement pour vous dépanner sur route ou à domicile.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection delay={0.1}>
              <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                <Truck className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Dépannage sur route</h3>
                <p className="text-muted-foreground">
                  Intervention rapide en cas de panne sur la route. Nous venons à vous avec tout l'équipement nécessaire.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                <MapPin className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Dépannage à domicile</h3>
                <p className="text-muted-foreground">
                  Votre véhicule ne démarre plus ? Nous nous déplaçons chez vous pour diagnostiquer et réparer.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                <Clock className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Disponibilité étendue</h3>
                <p className="text-muted-foreground">
                  Service disponible pour répondre à vos urgences mécaniques dans les meilleurs délais.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
                <Phone className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Contactez-nous</h3>
                <p className="text-muted-foreground">
                  Un simple appel et nous organisons l'intervention. Devis gratuit sur place.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.5}>
            <a href={legalInfo.phoneHref} className="inline-flex items-center justify-center bg-gradient-btn text-primary-foreground font-heading text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:opacity-90 hover:shadow-[0_0_25px_hsl(270_80%_60%/0.5)] transition-all duration-300 text-lg">
              <Phone className="w-5 h-5 mr-2" />
              Appelez-nous : {legalInfo.phone}
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Depannage;
