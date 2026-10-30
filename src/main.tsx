import { createRoot } from "react-dom/client";
// Polices hébergées en local (self-hosted) — aucun appel à Google Fonts.
// Familles nommées "Poppins" (titres) / "Inter", cohérentes avec src/index.css.
// Poppins : 400 (petits libellés en majuscules), 600 et 700 (titres).
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
