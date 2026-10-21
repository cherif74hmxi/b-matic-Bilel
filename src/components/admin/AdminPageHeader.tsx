import { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Boutons d'action affichés à droite (sous le titre sur mobile). */
  actions?: ReactNode;
}

const AdminPageHeader = ({ title, subtitle, actions }: AdminPageHeaderProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
    <div>
      <h1 className="font-heading text-xl md:text-2xl font-bold text-gradient-neon">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export default AdminPageHeader;
