import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { consentBandeau, consentCategories } from "@/data/consent";
import { readConsent, saveConsent, type Consent } from "@/lib/consent";

/**
 * Bandeau cookies / RGPD : accord pour les outils Google (Analytics, Ads).
 * Un écran « Accepter » / « Refuser » + un lien « Personnaliser » (détail
 * statistiques / marketing). Choix mémorisé (src/lib/consent.ts), jamais
 * redemandé ; modifiable via le lien « Gérer mes cookies » du pied de page
 * (événement global "open-cookie-consent"). La mesure interne sans cookie
 * (page_views, form_events) ne dépend pas de ce bandeau.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [choix, setChoix] = useState<Consent>({ analytics: false, marketing: false });

  useEffect(() => {
    if (!readConsent()) setVisible(true);

    const reopen = () => {
      const actuel = readConsent();
      setChoix(actuel ?? { analytics: false, marketing: false });
      // Choix déjà fait : on ouvre directement le détail pour le modifier.
      setDetails(Boolean(actuel));
      setVisible(true);
    };
    window.addEventListener("open-cookie-consent", reopen);
    return () => window.removeEventListener("open-cookie-consent", reopen);
  }, []);

  const choose = (consent: Consent) => {
    saveConsent(consent);
    setVisible(false);
    setDetails(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Choix des cookies"
      className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-3 z-[100] mx-auto max-w-3xl rounded-xl border border-border bg-card/95 backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {consentBandeau.texte}{" "}
            <Link to="/politique-de-confidentialite" className="text-primary underline underline-offset-2 hover:text-primary-hover">
              {consentBandeau.enSavoirPlus}
            </Link>
          </p>
        </div>
        {!details && (
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => choose({ analytics: false, marketing: false })}
                className="flex-1 sm:flex-none border border-border text-foreground rounded-full px-5 py-2.5 text-xs font-heading uppercase tracking-wider hover:bg-muted transition-colors"
              >
                {consentBandeau.refuser}
              </button>
              <button
                type="button"
                onClick={() => choose({ analytics: true, marketing: true })}
                className="flex-1 sm:flex-none bg-gradient-btn text-brand-foreground rounded-full px-6 py-2.5 text-xs font-heading uppercase tracking-wider hover:opacity-90 transition-all"
              >
                {consentBandeau.accepter}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDetails(true)}
              className="self-center text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
            >
              {consentBandeau.personnaliser}
            </button>
          </div>
        )}
      </div>

      {details && (
        <div className="mt-4 space-y-3">
          {consentCategories.map((c) => (
            <label key={c.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={choix[c.id]}
                onChange={(e) => setChoix((prev) => ({ ...prev, [c.id]: e.target.checked }))}
                className="w-4 h-4 accent-[hsl(var(--primary))] mt-0.5 shrink-0"
              />
              <span className="text-sm leading-snug">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="block text-xs text-muted-foreground">{c.detail}</span>
              </span>
            </label>
          ))}
          <p className="text-xs text-muted-foreground">{consentBandeau.interne}</p>
          <button
            type="button"
            onClick={() => choose(choix)}
            className="w-full sm:w-auto bg-gradient-btn text-brand-foreground rounded-full px-6 py-2.5 text-xs font-heading uppercase tracking-wider hover:opacity-90 transition-all"
          >
            {consentBandeau.enregistrer}
          </button>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
