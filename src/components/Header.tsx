import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import logo from "@/assets/bmatic-logo.webp";
import { legalInfo } from "@/data/legal";

// Liens de 1er niveau affichés AVANT le menu « Services »
const navLinksBefore = [
  { label: "Accueil", path: "/" },
  { label: "Véhicules", path: "/vehicules" },
  { label: "Pare-brise & Assurances", path: "/pare-brise" },
];

// Liens de 1er niveau affichés APRÈS le menu « Services »
const navLinksAfter = [
  { label: "Actualités", path: "/actualites" },
  { label: "Conseils", path: "/conseils" },
  { label: "À propos", path: "/a-propos" },
  { label: "Contact", path: "/contact" },
];

const serviceSubLinks = [
  { label: "Rachat", path: "/reprise" },
  { label: "Mécanique", path: "/mecanique" },
  { label: "Dépannage", path: "/depannage" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    setMobileServiceOpen(false);
    if (path.includes("#")) {
      const id = path.split("#")[1];
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleServiceEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServiceOpen(true);
  };

  const handleServiceLeave = () => {
    timeoutRef.current = setTimeout(() => setServiceOpen(false), 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="B MATIC" className="h-10 w-auto rounded" />
          <span className="font-heading font-bold text-lg tracking-wider text-foreground whitespace-nowrap">
            B MATIC
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
          {navLinksBefore.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="font-body text-xs xl:text-sm uppercase tracking-wider xl:tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={handleServiceEnter}
            onMouseLeave={handleServiceLeave}
          >
            <Link
              to="/#services"
              onClick={() => handleNavClick("/#services")}
              className="font-body text-xs xl:text-sm uppercase tracking-wider xl:tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1"
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
            </Link>

            {serviceOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                <div className="bg-popover border border-border rounded-lg shadow-xl py-2 min-w-[180px] animate-fade-in">
                  {serviceSubLinks.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => {
                        setServiceOpen(false);
                        handleNavClick(sub.path);
                      }}
                      className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navLinksAfter.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="font-body text-xs xl:text-sm uppercase tracking-wider xl:tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center shrink-0">
          {/* Icon alone up to 2xl (not enough room for the number), then the full number. */}
          <a
            href={legalInfo.phoneHref}
            aria-label={`Appeler le ${legalInfo.phone}`}
            className="flex items-center justify-center gap-2 min-w-11 min-h-11 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span className="hidden 2xl:inline">{legalInfo.phone}</span>
          </a>
        </div>

        <button
          className="lg:hidden text-foreground w-11 h-11 grid place-items-center -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto bg-background/95 backdrop-blur-xl border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-4">
            {navLinksBefore.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => handleNavClick(link.path)} className="font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2">
                {link.label}
              </Link>
            ))}

            <div>
              <button
                onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                className="font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-1 w-full"
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileServiceOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileServiceOpen && (
                <div className="pl-4 flex flex-col gap-2 mt-2">
                  <Link to="/#services" onClick={() => handleNavClick("/#services")} className="text-sm text-muted-foreground hover:text-foreground py-1">
                    Tous les services
                  </Link>
                  {serviceSubLinks.map((sub) => (
                    <Link key={sub.path} to={sub.path} onClick={() => handleNavClick(sub.path)} className="text-sm text-muted-foreground hover:text-foreground py-1">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinksAfter.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => handleNavClick(link.path)} className="font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2">
                {link.label}
              </Link>
            ))}
            <a href={legalInfo.phoneHref} className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Phone className="w-4 h-4" />
              {legalInfo.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
