import { Navigation } from "lucide-react";
import { legalInfo } from "@/data/legal";

// ============================================================================
//  MapEmbed — carte Google Maps du centre (affichée directement) + « Itinéraire »
// ----------------------------------------------------------------------------
//  L'adresse complète est passée à Google : le repère tombe sur le bâtiment.
//  RGPD : Google peut déposer ses propres cookies à l'affichage de la carte ;
//  c'est indiqué dans la politique de confidentialité (§ 4 et 5) et dans le
//  bandeau d'information. Le bouton « Itinéraire » ouvre Google Maps dans un
//  nouvel onglet. Adresse : src/data/legal.ts → mapsQuery.
// ============================================================================

const q = encodeURIComponent(legalInfo.mapsQuery);
const EMBED_URL = `https://maps.google.com/maps?q=${q}&z=16&hl=fr&output=embed`;
export const ITINERAIRE_URL = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

const MapEmbed = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden border border-border bg-muted">
      <iframe
        src={EMBED_URL}
        title={`Plan d'accès : ${legalInfo.siteName}, ${legalInfo.mapsQuery}`}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
    <a href={ITINERAIRE_URL} target="_blank" rel="noopener noreferrer" className="btn-main min-h-12 w-full mt-3">
      <Navigation className="w-4 h-4" aria-hidden="true" /> Itinéraire
    </a>
  </div>
);

export default MapEmbed;
