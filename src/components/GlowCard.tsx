import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

// Carte de base du site : fond plein, bordure fine, aucune lueur (le nom est
// historique, il date du thème néon).
const GlowCard = ({ children, className = "" }: GlowCardProps) => {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GlowCard;
