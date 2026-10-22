import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/bmatic-logo.webp";
import { legalInfo } from "@/data/legal";

const Footer = () => {
  const openCookieSettings = () => window.dispatchEvent(new Event("open-cookie-consent"));

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="B MATIC" className="h-10 rounded" />
              <span className="font-heading font-bold text-lg tracking-wider">B MATIC</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Achat · Mécanique · Dépannage<br />
              Votre garage automobile de confiance, ouvert 24h/24.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-foreground">Liens rapides</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", path: "/" },
                { label: "Pare-brise & Assurances", path: "/pare-brise" },
                { label: "Mécanique", path: "/mecanique" },
                { label: "Reprise de véhicule", path: "/reprise" },
                { label: "Dépannage", path: "/depannage" },
                { label: "Conseils", path: "/conseils" },
                { label: "À propos", path: "/a-propos" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-foreground">Informations légales</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <button onClick={openCookieSettings} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                  Gérer mes cookies
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-neon-purple shrink-0" />
                <span>{legalInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neon-purple shrink-0" />
                <a href={legalInfo.phoneHref} className="hover:text-foreground transition-colors">{legalInfo.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon-purple shrink-0" />
                <a href={`mailto:${legalInfo.email}`} className="hover:text-foreground transition-colors">{legalInfo.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="neon-line mt-10 mb-6" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} B MATIC — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
