import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { formatPrice, vehicleSpecs } from "@/lib/contentModel";
import { orderedPhotos, photoSrcSet, photoUrl, thumbPath, type PublicVehicleSummary } from "@/lib/publicContent";
import { occasionsTextes } from "@/data/occasions";

export const SoldBadge = ({ className = "" }: { className?: string }) => (
  <span className={`rounded-full bg-neon-pink text-primary-foreground px-3 py-1 text-xs font-heading uppercase tracking-wider shadow-lg ${className}`}>
    {occasionsTextes.vendu}
  </span>
);

const VehicleCard = ({ vehicle: v, eager = false }: { vehicle: PublicVehicleSummary; eager?: boolean }) => {
  const cover = orderedPhotos(v.vehicle_photos)[0];
  const sold = v.status === "sold";
  return (
    <Link
      to={`/vehicules/${v.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-card border border-border hover:border-neon-purple/60 hover:shadow-[0_0_25px_hsl(270_80%_60%/0.25)] transition-all"
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {cover ? (
          <img
            src={photoUrl(thumbPath(cover.storage_path))}
            srcSet={photoSrcSet(cover.storage_path)}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            alt={cover.alt ?? v.title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={`w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ${sold ? "grayscale-[60%] opacity-80" : ""}`}
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <Car className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        {sold && <SoldBadge className="absolute top-3 left-3" />}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold leading-snug line-clamp-2">{v.title}</h3>
        <p className="text-xs text-muted-foreground mt-1.5">{vehicleSpecs(v)}</p>
        <p className={`font-heading text-xl font-bold mt-auto pt-3 ${sold ? "text-muted-foreground line-through decoration-1" : "text-gradient-neon"}`}>
          {formatPrice(v.price_eur)}
        </p>
      </div>
    </Link>
  );
};

export default VehicleCard;
