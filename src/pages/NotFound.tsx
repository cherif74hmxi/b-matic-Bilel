import useSeo from "@/hooks/useSeo";
import NeonButton from "@/components/NeonButton";
import { notFoundSeo } from "@/data/seo";
import { RDV_PATH } from "@/data/rdv";

const NotFound = () => {
  useSeo({ ...notFoundSeo, noindex: true });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 text-center max-w-xl">
        <p className="font-heading text-6xl font-bold text-foreground mb-4">404</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-4">Page introuvable</h1>
        <p className="text-muted-foreground mb-8">
          Cette page n'existe pas ou a été déplacée. Votre devis pare-brise reste à portée de clic.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <NeonButton to="/">Retour à l'accueil</NeonButton>
          <NeonButton to={RDV_PATH}>Demander un devis</NeonButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
