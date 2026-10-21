import { ReactNode } from "react";

/** Bloc de formulaire (carte) avec titre. */
export const FormSection = ({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) => (
  <section className="bg-gradient-card border border-border rounded-xl p-4 md:p-6">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="font-heading text-sm uppercase tracking-wider">{title}</h2>
      {aside}
    </div>
    <div className="grid gap-4">{children}</div>
  </section>
);

/** Champ avec libellé, aide et message d'erreur reliés pour l'accessibilité. */
export const Field = ({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <div className="min-w-0">
    <label htmlFor={id} className="block text-sm mb-1.5">
      {label}
      {required && <span className="text-neon-pink"> *</span>}
    </label>
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="text-xs text-muted-foreground mt-1.5">
        {hint}
      </p>
    )}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs text-neon-pink mt-1.5">
        {error}
      </p>
    )}
  </div>
);
