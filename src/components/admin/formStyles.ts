// Styles partagés des formulaires admin (mobile-first : texte 16 px pour
// éviter le zoom automatique d'iOS, cibles tactiles ≥ 48 px).
export const adminInputClass =
  "w-full min-h-[48px] bg-background border border-input rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all aria-[invalid=true]:border-neon-pink";

export const adminSelectClass = `${adminInputClass} appearance-none`;

export const adminTextareaClass = `${adminInputClass} min-h-[160px] leading-relaxed`;
