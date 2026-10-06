import { ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface LegalPageProps {
  title: ReactNode;
  updated?: string;
  children: ReactNode;
}

/**
 * Mise en page commune aux pages légales (politique de confidentialité,
 * mentions légales). Applique la charte néon et une typographie lisible.
 */
const LegalPage = ({ title, updated, children }: LegalPageProps) => {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-3">
            <span className="text-gradient-neon">{title}</span>
          </h1>
          {updated && (
            <p className="text-muted-foreground text-center text-sm mb-12">
              Dernière mise à jour : {updated}
            </p>
          )}
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="legal-prose space-y-6 text-sm md:text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default LegalPage;
