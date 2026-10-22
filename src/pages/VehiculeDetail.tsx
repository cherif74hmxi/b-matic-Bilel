import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, MessageCircle, Phone, RefreshCw } from "lucide-react";
import VehicleGallery from "@/components/vehicules/VehicleGallery";
import { SoldBadge } from "@/components/vehicules/VehicleCard";
import NeonButton from "@/components/NeonButton";
import useSeo, { useNoIndex } from "@/hooks/useSeo";
import { getPublicVehicle, orderedPhotos, paragraphs, photoUrl, publicViewCount, resolveSlugRedirect, type PublicVehicleWithPhotos } from "@/lib/publicContent";
import { FUEL_LABELS, GEARBOX_LABELS, formatKm, formatPrice, vehicleSpecs } from "@/lib/contentModel";
import { legalInfo } from "@/data/legal";
import { occasionsSeo, occasionsTextes } from "@/data/occasions";

const NoIndex = () => {
  useNoIndex();
  return null;
};

/** Données structurées schema.org Car (+ offre et vendeur). */
function carJsonLd(v: PublicVehicleWithPhotos, url: string) {
  const sold = v.status === "sold";
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: v.title,
    url,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleConfiguration: v.version ?? undefined,
    vehicleModelDate: v.year ? String(v.year) : undefined,
    mileageFromOdometer: v.mileage_km !== null ? { "@type": "QuantitativeValue", value: v.mileage_km, unitCode: "KMT" } : undefined,
    fuelType: v.fuel ? FUEL_LABELS[v.fuel] : undefined,
    vehicleTransmission: v.gearbox ? GEARBOX_LABELS[v.gearbox] : undefined,
    // Power entered in metric horsepower (ch) → kW (unambiguous unit for search engines).
    vehicleEngine: v.power_hp
      ? { "@type": "EngineSpecification", enginePower: { "@type": "QuantitativeValue", value: Math.round(v.power_hp * 0.7355), unitCode: "KWT" } }
      : undefined,
    itemCondition: "https://schema.org/UsedCondition",
    image: orderedPhotos(v.vehicle_photos).map((p) => photoUrl(p.storage_path)),
    description: v.description ?? undefined,
    offers:
      v.price_eur !== null
        ? {
            "@type": "Offer",
            price: v.price_eur,
            priceCurrency: "EUR",
            availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            itemCondition: "https://schema.org/UsedCondition",
            seller: {
              "@type": "AutoDealer",
              name: "B MATIC",
              telephone: legalInfo.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: legalInfo.addressParts.street,
                postalCode: legalInfo.addressParts.postalCode,
                addressLocality: legalInfo.addressParts.city,
                addressCountry: legalInfo.addressParts.country,
              },
            },
          }
        : undefined,
  };
}

const VehiculeDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["public", "vehicle", slug], queryFn: () => getPublicVehicle(slug) });
  const vehicle = query.data ?? null;
  const views = useQuery({
    queryKey: ["public", "views", "vehicules", slug],
    queryFn: () => publicViewCount("vehicules", slug),
    enabled: vehicle !== null,
    staleTime: 60_000,
  });

  // Fiche absente : l'adresse a peut-être changé après publication → redirection.
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    setNotFound(false);
    if (!query.isSuccess || query.data !== null) return;
    let cancelled = false;
    void resolveSlugRedirect("vehicules", slug).then((target) => {
      if (cancelled) return;
      if (target && target !== slug) navigate(`/vehicules/${target}`, { replace: true });
      else setNotFound(true);
    });
    return () => {
      cancelled = true;
    };
  }, [query.isSuccess, query.data, slug, navigate]);

  const url = typeof window !== "undefined" ? `${window.location.origin}/vehicules/${slug}` : "";
  const jsonLd = useMemo(() => (vehicle ? carJsonLd(vehicle, url) : undefined), [vehicle, url]);
  const sold = vehicle?.status === "sold";
  useSeo({
    title: vehicle ? occasionsTextes.seoTitre(vehicle.title, formatPrice(vehicle.price_eur), sold) : occasionsSeo.title,
    // Always a description: otherwise the one from the previous page would stay.
    description: vehicle ? occasionsTextes.seoDescription(vehicle.title, vehicleSpecs(vehicle)) : occasionsSeo.description,
    jsonLd,
  });

  const back = (
    <Link to="/vehicules" className="inline-flex items-center gap-1.5 min-h-[44px] text-sm text-muted-foreground hover:text-foreground mb-2">
      <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.retour}
    </Link>
  );

  if (query.isError && !query.data) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center max-w-md">
        {back}
        <p className="text-muted-foreground my-6">{occasionsTextes.erreur}</p>
        <button type="button" onClick={() => void query.refetch()} className="btn-ghost min-h-[44px]">
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.reessayer}
        </button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 text-center max-w-md">
        <NoIndex />
        <h1 className="font-heading text-2xl font-bold mb-4">
          <span className="text-gradient-neon">{occasionsTextes.introuvable}</span>
        </h1>
        <NeonButton to="/vehicules">{occasionsTextes.retour}</NeonButton>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="pt-24 pb-20 container mx-auto px-4 max-w-5xl" aria-busy="true">
        {back}
        <div className="animate-pulse grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="aspect-[4/3] rounded-2xl bg-muted" />
          <div className="space-y-3">
            <div className="h-7 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-9 bg-muted rounded w-1/3 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  const photos = orderedPhotos(vehicle.vehicle_photos);
  const whatsapp = `${legalInfo.whatsappHref}?text=${encodeURIComponent(occasionsTextes.messageWhatsapp(vehicle.title, url))}`;
  const specs: [string, string | null][] = [
    ["Marque", vehicle.make],
    ["Modèle", vehicle.model],
    ["Version", vehicle.version],
    ["Année", vehicle.year ? String(vehicle.year) : null],
    ["Kilométrage", formatKm(vehicle.mileage_km)],
    ["Carburant", vehicle.fuel ? FUEL_LABELS[vehicle.fuel] : null],
    ["Boîte de vitesses", vehicle.gearbox ? GEARBOX_LABELS[vehicle.gearbox] : null],
    ["Puissance", vehicle.power_hp ? `${vehicle.power_hp} ch` : null],
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {back}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
          <VehicleGallery photos={photos} title={vehicle.title} sold={sold} />

          {/* ---------- Résumé + contact ---------- */}
          <div className="min-w-0 lg:sticky lg:top-24">
            {sold && <SoldBadge className="inline-block mb-3" />}
            <h1 className="font-heading text-2xl md:text-3xl font-bold leading-tight">{vehicle.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">{vehicleSpecs(vehicle)}</p>
            <p className={`font-heading text-3xl font-bold mt-4 ${sold ? "text-muted-foreground line-through decoration-2" : "text-gradient-neon"}`}>
              {formatPrice(vehicle.price_eur)}
            </p>
            {views.data ? (
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                <Eye className="w-3.5 h-3.5" aria-hidden="true" /> {occasionsTextes.vues(views.data)}
              </p>
            ) : null}

            <div className="mt-5">
              {sold ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{occasionsTextes.ctaVendu}</p>
                  <NeonButton to="/vehicules" className="w-full min-h-[48px]">
                    {occasionsTextes.retour}
                  </NeonButton>
                </>
              ) : (
                <div className="grid gap-3">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-main min-h-[48px]">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.ctaWhatsapp}
                  </a>
                  <a href={legalInfo.phoneHref} className="btn-ghost min-h-[48px]">
                    <Phone className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.ctaAppeler} {legalInfo.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Caractéristiques + description ---------- */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 mt-8">
          <div className="min-w-0 order-2 lg:order-1">
            {vehicle.description && (
              <section>
                <h2 className="font-heading text-lg font-semibold mb-3">{occasionsTextes.description}</h2>
                <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line">
                  {paragraphs(vehicle.description).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}
          </div>
          <section className="order-1 lg:order-2 rounded-2xl border border-border bg-gradient-card p-5">
            <h2 className="font-heading text-lg font-semibold mb-3">{occasionsTextes.caracteristiques}</h2>
            <dl className="divide-y divide-border text-sm">
              {specs
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-right">{value}</dd>
                  </div>
                ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetail;
