import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, currentTheme } from "@/lib/theme";

/** Bouton soleil / lune du menu : bascule entre thème clair et sombre. */
const ThemeToggle = () => {
  const [theme, setTheme] = useState(currentTheme);
  const sombre = theme === "sombre";

  const toggle = () => {
    const next = sombre ? "clair" : "sombre";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={sombre ? "Passer en mode clair" : "Passer en mode sombre"}
      title={sombre ? "Mode clair" : "Mode sombre"}
      className="w-11 h-11 shrink-0 grid place-items-center rounded-lg text-foreground/80 transition-colors hover:text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {sombre ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
