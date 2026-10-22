import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, SlidersHorizontal, X, RefreshCw, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import VehicleCard from "@/components/vehicules/VehicleCard";
import VehicleFiltersPanel, { type FilterOptions } from "@/components/vehicules/VehicleFiltersPanel";
import useSeo from "@/hooks/useSeo";
import { listPublicVehicles } from "@/lib/publicContent";
import { FUEL_LABELS, GEARBOX_LABELS, type Fuel, type Gearbox } from "@/lib/contentModel";
import { DEFAULT_FILTERS, SORT_LABELS, activeFilterCount, applyFilters, filtersFromParams, filtersToParams, type SortKey, type VehicleFilters } from "@/lib/vehicleFilters";
import { legalInfo } from "@/data/legal";
import { occasionsIntro, occasionsSeo, occasionsTextes } from "@/data/occasions";

const nf = new Intl.NumberFormat("fr-BE");

/** Étiquettes des filtres actifs (supprimables d'un geste). */
function activeChips(f: VehicleFilters): { label: string; clear: Partial<VehicleFilters> }[] {
  const chips: { label: string; clear: Partial<VehicleFilters> }[] = [];
  if (f.q.trim()) chips.push({ label: `« ${f.q.trim()} »`, clear: { q: "" } });
  if (f.marque) chips.push({ label: f.marque, clear: { marque: "" } });
  if (f.prixMax) chips.push({ label: `≤ ${nf.format(f.prixMax)} €`, clear: { prixMax: null } });
  if (f.anneeMin) chips.push({ label: `${f.anneeMin} et +`, clear: { anneeMin: null } });
  if (f.kmMax) chips.push({ label: `≤ ${nf.format(f.kmMax)} km`, clear: { kmMax: null } });
  f.carburants.forEach((c) => chips.push({ label: FUEL_LABELS[c], clear: { carburants: f.carburants.filter((x) => x !== c) } }));
  if (f.boite) chips.push({ label: GEARBOX_LABELS[f.boite], clear: { boite: "" } });
  if (!f.vendus) chips.push({ label: "Sans les vendus", clear: { vendus: true } });
  return chips;
}

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-border bg-gradient-card animate-pulse" aria-hidden="true">
    <div className="aspect-[4/3] bg-muted" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-6 bg-muted rounded w-1/3 mt-4" />
    </div>
  </div>
);

const Vehicules = () => {
  useSeo(occasionsSeo);
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const update = (patch: Partial<VehicleFilters>) => setParams(filtersToParams({ ...filters, ...patch }), { replace: true });
  const [sheetOpen, setSheetOpen] = useState(false);

  const query = useQuery({ queryKey: ["public", "vehicles"], queryFn: () => listPublicVehicles(), staleTime: 60_000 });
  const all = useMemo(() => query.data ?? [], [query.data]);

  const options = useMemo<FilterOptions>(() => {
    const counts = new Map<string, number>();
    all.forEach((v) => counts.set(v.make, (counts.get(v.make) ?? 0) + 1));
    return {
      makes: [...counts].map(([make, count]) => ({ make, count })).sort((a, b) => a.make.localeCompare(b.make, "fr")),
      years: [...new Set(all.map((v) => v.year).filter((y): y is number => y !== null))].sort((a, b) => b - a),
      fuels: (Object.keys(FUEL_LABELS) as Fuel[]).filter((f) => all.some((v) => v.fuel === f)),
      gearboxes: (Object.keys(GEARBOX_LABELS) as Gearbox[]).filter((g) => all.some((v) => v.gearbox === g)),
    };
  }, [all]);

  const results = useMemo(() => applyFilters(all, filters), [all, filters]);
  const activeCount = activeFilterCount(filters);
  const chips = activeChips(filters);
  const reset = () => setParams(filtersToParams({ ...DEFAULT_FILTERS, tri: filters.tri }), { replace: true });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="max-w-2xl mb-8">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
              <span className="text-gradient-neon">{occasionsIntro.titre}</span>
            </h1>
            <p className="text-muted-foreground">{occasionsIntro.texte}</p>
          </div>
        </AnimatedSection>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* ---------- Filtres (ordinateur) ---------- */}
          <aside className="hidden lg:block" aria-label={occasionsTextes.filtres}>
            <div className="sticky top-24 rounded-2xl border border-border bg-gradient-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-sm uppercase tracking-wider">{occasionsTextes.filtres}</h2>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="text-xs text-neon-cyan underline min-h-[44px] px-1">
                    {occasionsTextes.reinitialiser}
                  </button>
                )}
              </div>
              <VehicleFiltersPanel filters={filters} options={options} onChange={update} idPrefix="fd" />
            </div>
          </aside>

          <div className="min-w-0">
            {/* ---------- Recherche + tri ---------- */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder={occasionsTextes.recherche}
                aria-label="Rechercher un véhicule"
                className="w-full min-h-[48px] bg-input border border-border rounded-xl pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 min-h-[44px] rounded-full border border-border px-4 text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                {occasionsTextes.filtres}
                {activeCount > 0 && <span className="rounded-full bg-neon-purple text-primary-foreground text-xs px-1.5 min-w-5 text-center">{activeCount}</span>}
              </button>
              <label htmlFor="v-tri" className="sr-only">
                Trier par
              </label>
              <select
                id="v-tri"
                value={filters.tri}
                onChange={(e) => update({ tri: e.target.value as SortKey })}
                className="min-h-[44px] min-w-0 flex-1 sm:flex-none bg-input border border-border rounded-full px-4 text-base md:text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="w-full sm:w-auto sm:ml-auto text-sm text-muted-foreground whitespace-nowrap" aria-live="polite">
                {query.isSuccess && occasionsTextes.resultats(results.length)}
              </p>
            </div>

            {chips.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-4" aria-label="Filtres actifs">
                {chips.map((c) => (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => update(c.clear)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] rounded-full bg-primary/15 border border-neon-purple/40 pl-3 pr-2 text-sm"
                      aria-label={`Retirer le filtre ${c.label}`}
                    >
                      {c.label} <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* ---------- Résultats ---------- */}
            {query.isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : query.isError && !query.data ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{occasionsTextes.erreur}</p>
                <button type="button" onClick={() => void query.refetch()} className="btn-ghost min-h-[44px]">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.reessayer}
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 max-w-md mx-auto">
                <p className="text-muted-foreground mb-5">{all.length === 0 ? occasionsTextes.stockVide : occasionsTextes.aucunResultat}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {activeCount > 0 && (
                    <button type="button" onClick={reset} className="btn-ghost min-h-[44px]">
                      {occasionsTextes.reinitialiser}
                    </button>
                  )}
                  <a href={legalInfo.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-main min-h-[44px]">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" /> {occasionsTextes.ctaWhatsapp}
                  </a>
                </div>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((v, i) => (
                  <li key={v.id}>
                    <VehicleCard vehicle={v} eager={i < 2} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Filtres (téléphone) : panneau du bas ---------- */}
      <DialogPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[110] bg-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 bottom-0 z-[110] max-h-[88vh] flex flex-col rounded-t-2xl border-t border-border bg-background data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom focus:outline-none"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <DialogPrimitive.Title className="font-heading text-sm uppercase tracking-wider">{occasionsTextes.filtres}</DialogPrimitive.Title>
              <DialogPrimitive.Close className="w-11 h-11 grid place-items-center rounded-full hover:bg-muted" aria-label="Fermer les filtres">
                <X className="w-5 h-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5">
              <VehicleFiltersPanel filters={filters} options={options} onChange={update} idPrefix="fm" />
            </div>
            <div className="flex gap-3 p-4 border-t border-border pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button type="button" onClick={reset} disabled={activeCount === 0} className="btn-ghost min-h-[48px] flex-1 disabled:opacity-45">
                {occasionsTextes.reinitialiser}
              </button>
              <DialogPrimitive.Close className="btn-main min-h-[48px] flex-[1.4]">
                {!query.isSuccess ? "Voir les résultats" : results.length === 0 ? "Aucun résultat" : `Voir ${occasionsTextes.resultats(results.length).toLowerCase()}`}
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default Vehicules;
