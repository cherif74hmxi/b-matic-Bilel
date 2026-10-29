import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "bmatic-cookie-consent";

/**
 * Bandeau d'information cookies / RGPD.
 * Le site n'utilise aucun cookie de suivi : ce bandeau informe l'utilisateur
 * et mémorise son choix (localStorage). Il peut être rouvert via le lien
 * « Gérer mes cookies » du pied de page (événement global "open-cookie-consent").
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* stockage indisponible */ }
    if (!stored) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener("open-cookie-consent", reopen);
    return () => window.removeEventListener("open-cookie-consent", reopen);
  }, []);

  const choose = (choice: "accepted" | "refused") => {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* stockage indisponible */ }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Information sur les cookies"
      className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-3 z-[100] mx-auto max-w-3xl rounded-xl border border-border bg-card/95 backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ce site utilise uniquement des cookies strictement nécessaires à son bon
            fonctionnement — aucun suivi publicitaire.{" "}
            <Link to="/politique-de-confidentialite" className="text-primary underline underline-offset-2 hover:text-foreground">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose("refused")}
            className="flex-1 sm:flex-none border border-border text-foreground rounded-full px-5 py-2.5 text-xs font-heading uppercase tracking-wider hover:bg-muted transition-colors"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 sm:flex-none bg-gradient-btn text-primary-foreground rounded-full px-6 py-2.5 text-xs font-heading uppercase tracking-wider hover:opacity-90 transition-all"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
