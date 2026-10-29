import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { MapPin, Navigation } from "lucide-react";
import { legalInfo } from "@/data/legal";

// ============================================================================
//  MapEmbed — carte OpenStreetMap du centre + bouton « Itinéraire »
// ----------------------------------------------------------------------------
//  RGPD : OpenStreetMap ne dépose aucun cookie, la carte s'affiche donc
//  directement, sans bandeau ni consentement. Les tuiles viennent des serveurs
//  d'OpenStreetMap (qui voient l'adresse IP, comme pour toute image externe :
//  voir la politique de confidentialité). Le bouton « Itinéraire » n'ouvre
//  Google Maps qu'au clic, dans un nouvel onglet.
//  Leaflet est chargé à l'approche de la carte : aucun poids au premier affichage.
//  Adresse et position : src/data/legal.ts → mapsQuery, mapsCoords.
// ============================================================================

const q = encodeURIComponent(legalInfo.mapsQuery);
export const ITINERAIRE_URL = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

/** Repère aux couleurs de la marque (SVG, pas d'image à charger). */
const PIN_SVG = `<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">
  <path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 41 16 41s15-14 15-25.2C31 7.6 24.3 1 16 1z" style="fill:hsl(var(--primary))" stroke="#fff" stroke-width="2"/>
  <circle cx="16" cy="15.5" r="5.5" fill="#fff"/>
</svg>`;

const MapEmbed = ({ className = "" }: { className?: string }) => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let map: LeafletMap | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: L }] = await Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]);
      if (cancelled) return;
      const { lat, lng } = legalInfo.mapsCoords;
      map = L.map(node, {
        center: [lat, lng],
        zoom: 16,
        scrollWheelZoom: false,
        // Sur téléphone, un doigt fait défiler la page (pas la carte).
        dragging: !L.Browser.mobile,
      });
      map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      }).addTo(map);

      const popup = document.createElement("div");
      const nom = document.createElement("strong");
      nom.textContent = legalInfo.siteName;
      popup.append(nom, document.createElement("br"), legalInfo.mapsQuery);

      L.marker([lat, lng], {
        icon: L.divIcon({ className: "", html: PIN_SVG, iconSize: [32, 42], iconAnchor: [16, 41], popupAnchor: [0, -36] }),
        title: legalInfo.siteName,
        alt: legalInfo.siteName,
      })
        .addTo(map)
        .bindPopup(popup);
    };

    // Chargement quand la carte approche de l'écran.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          init().catch(() => {
            /* Hors ligne : l'adresse reste affichée en texte. */
          });
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(node);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative z-0 aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden border border-border bg-muted">
        {/* Visible le temps du chargement (ou si la carte ne charge pas). */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 text-center">
          <MapPin className="w-7 h-7 text-primary" aria-hidden="true" />
          <p className="font-semibold leading-snug">{legalInfo.mapsQuery}</p>
        </div>
        <div
          ref={el}
          className="bm-map absolute inset-0"
          role="region"
          aria-label={`Carte : ${legalInfo.siteName}, ${legalInfo.mapsQuery}`}
        />
      </div>
      <a href={ITINERAIRE_URL} target="_blank" rel="noopener noreferrer" className="btn-main min-h-12 w-full mt-3">
        <Navigation className="w-4 h-4" aria-hidden="true" /> Itinéraire
      </a>
    </div>
  );
};

export default MapEmbed;
