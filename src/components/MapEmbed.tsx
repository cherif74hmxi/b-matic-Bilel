import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { legalInfo } from "@/data/legal";

// ============================================================================
//  MapEmbed — carte Google Maps du centre + bouton « Itinéraire »
// ----------------------------------------------------------------------------
//  RGPD : la carte Google (qui peut déposer des cookies) n'est chargée QUE si
//  le visiteur clique sur « Afficher la carte ». Avant, rien n'est demandé à
//  Google. Le bouton « Itinéraire » ouvre simplement Google Maps dans un nouvel
//  onglet. Adresse : src/data/legal.ts → mapsQuery.
// ============================================================================

const q = encodeURIComponent(legalInfo.mapsQuery);
const EMBED_URL = `https://maps.google.com/maps?q=${q}&z=15&hl=fr&output=embed`;
export const ITINERAIRE_URL = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

const MapEmbed = ({ className = "" }: { className?: string }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden border border-border bg-muted">
        {visible ? (
          <iframe
            src={EMBED_URL}
            title={`Plan d'accès : ${legalInfo.mapsQuery}`}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <MapPin className="w-7 h-7 text-foreground" aria-hidden="true" />
            <p className="font-semibold leading-snug">{legalInfo.mapsQuery}</p>
            <button type="button" onClick={() => setVisible(true)} className="btn-ghost min-h-11 !py-2">
              Afficher la carte
            </button>
            <p className="text-xs text-muted-foreground max-w-xs">
              La carte est fournie par Google, qui peut déposer des cookies : elle ne se charge que si vous cliquez.
            </p>
          </div>
        )}
      </div>
      <a href={ITINERAIRE_URL} target="_blank" rel="noopener noreferrer" className="btn-main min-h-12 w-full mt-3">
        <Navigation className="w-4 h-4" aria-hidden="true" /> Itinéraire
      </a>
    </div>
  );
};

export default MapEmbed;
