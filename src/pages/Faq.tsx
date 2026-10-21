import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import NeonButton from "@/components/NeonButton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import useSeo from "@/hooks/useSeo";
import { faqItems, type FaqCategorie } from "@/data/faq";

const Faq = () => {
  // Groupe les questions par catégorie, en conservant l'ordre d'apparition.
  const groupes = useMemo(() => {
    const map = new Map<FaqCategorie, typeof faqItems>();
    for (const item of faqItems) {
      const liste = map.get(item.categorie) ?? [];
      liste.push(item);
      map.set(item.categorie, liste);
    }
    return Array.from(map.entries());
  }, []);

  // Données structurées FAQPage (schema.org), générées depuis la même source.
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.reponse },
      })),
    }),
    [],
  );

  useSeo({
    title: "FAQ & Conseils — B MATIC",
    description:
      "Questions fréquentes sur le remplacement de pare-brise et l'assurance, les rendez-vous, le paiement sur place, la reprise de véhicule et l'entretien chez B MATIC.",
    jsonLd,
  });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <HelpCircle className="w-9 h-9 text-neon-cyan mx-auto mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-neon">FAQ &amp; Conseils</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Les réponses aux questions les plus fréquentes. Une autre question ? Contactez-nous.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-10">
          {groupes.map(([categorie, items], gi) => (
            <AnimatedSection key={categorie} delay={gi * 60}>
              <h2 className="font-heading text-lg md:text-xl font-bold mb-3 text-neon-purple">
                {categorie}
              </h2>
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

        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center mt-14">
            <p className="text-muted-foreground mb-6">
              Vous ne trouvez pas votre réponse ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <NeonButton to="/contact">Nous contacter</NeonButton>
              <NeonButton to="/mecanique">Prendre rendez-vous</NeonButton>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Faq;
