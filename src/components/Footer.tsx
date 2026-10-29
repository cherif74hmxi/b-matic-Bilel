import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/bmatic-logo.webp";
import { legalInfo } from "@/data/legal";
import { horairesResume } from "@/data/horaires";
import { RDV_PATH } from "@/data/rdv";

const Footer = () => {
  const openCookieSettings = () => window.dispatchEvent(new Event("open-cookie-consent"));

  return (
    <footer className="border-t border-border bg-muted/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="B MATIC" className="h-10 rounded" />
              <span className="font-heading font-bold text-lg tracking-wider">B MATIC</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pare-brise · Vitrages auto<br />
              Remplacement et réparation à Ans et jusqu'à 70 km autour de Liège.
              <br />
              {horairesResume}.
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", path: "/" },
                { label: "Pare-brise & Assurances", path: "/pare-brise" },
                { label: "Demander un devis / RDV", path: RDV_PATH },
                { label: "Actualités", path: "/actualites" },
                { label: "Conseils", path: "/conseils" },
                { label: "À propos", path: "/a-propos" },
                { label: "Contact", path: "/contact" },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Informations légales</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <button onClick={openCookieSettings} className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                  Gérer mes cookies
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{legalInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={legalInfo.phoneHref} className="hover:text-primary transition-colors">{legalInfo.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${legalInfo.email}`} className="min-w-0 break-all hover:text-primary transition-colors">{legalInfo.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 mb-6" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} B MATIC — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
