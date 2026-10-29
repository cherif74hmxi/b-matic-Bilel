import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/bmatic-logo.webp";
import { legalInfo } from "@/data/legal";

// Navigation volontairement courte (pivot pare-brise). Le logo ramène à
// l'accueil ; les autres pages (à propos, légal) sont dans le pied de page.
const navLinks = [
  { label: "Pare-brise", path: "/pare-brise" },
  { label: "Actualités", path: "/actualites" },
  { label: "Conseils", path: "/conseils" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-body text-[15px] font-medium transition-colors duration-200 whitespace-nowrap ${
      isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border border-t-[3px] border-t-primary">
      <div className="container mx-auto flex items-center justify-between gap-4 py-3 px-4">
        <Link to="/" onClick={close} className="flex items-center gap-3 shrink-0" aria-label="B MATIC, accueil">
          <img src={logo} alt="" className="h-10 w-auto rounded" />
          <span className="font-heading font-bold text-lg tracking-wider text-foreground whitespace-nowrap">
            B MATIC
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-9" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {/* Téléphone toujours visible : c'est l'action la plus rapide sur mobile. */}
          <a
            href={legalInfo.phoneHref}
            aria-label={`Appeler le ${legalInfo.phone}`}
            className="btn-main !min-h-11 !px-3 lg:!px-4 !text-sm"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span className="hidden lg:inline">{legalInfo.phone}</span>
          </a>
          <button
            className="md:hidden text-foreground w-11 h-11 grid place-items-center -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto bg-background border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-1" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} onClick={close} className={(s) => `${linkClass(s)} py-3`}>
                {link.label}
              </NavLink>
            ))}
            <a href={legalInfo.phoneHref} className="flex items-center gap-2 text-sm font-semibold text-primary py-3">
              <Phone className="w-4 h-4" aria-hidden="true" />
              {legalInfo.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
