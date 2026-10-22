import { FUEL_LABELS, GEARBOX_LABELS, type Fuel, type Gearbox } from "@/lib/contentModel";
import type { VehicleFilters } from "@/lib/vehicleFilters";
import { filtresKmMax, filtresPrixMax, occasionsTextes } from "@/data/occasions";

// ============================================================================
//  Panneau de filtres (colonne sur ordinateur, panneau du bas sur téléphone)
//  Les options ne proposent que ce qui existe dans le stock (marques, années,
//  carburants) : jamais de filtre qui mène à zéro résultat d'office.
// ============================================================================

const selectClass =
  "w-full min-h-[44px] bg-input border border-border rounded-lg px-3 py-2 text-base md:text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50";
const nf = new Intl.NumberFormat("fr-BE");

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`min-h-[44px] rounded-full border px-3.5 text-sm transition-colors ${active ? "border-neon-purple bg-primary/20 text-foreground font-semibold" : "border-border text-muted-foreground hover:text-foreground"}`}
  >
    {children}
  </button>
);

const Group = ({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) => (
  <div>
    {htmlFor ? (
      <label htmlFor={htmlFor} className="block text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
    ) : (
      <p className="text-xs font-heading uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
    )}
    {children}
  </div>
);

export interface FilterOptions {
  /** Marques présentes dans le stock, avec leur nombre de véhicules. */
  makes: { make: string; count: number }[];
  years: number[];
  fuels: Fuel[];
  gearboxes: Gearbox[];
}

const VehicleFiltersPanel = ({
  filters,
  options,
  onChange,
  idPrefix,
}: {
  filters: VehicleFilters;
  options: FilterOptions;
  onChange: (patch: Partial<VehicleFilters>) => void;
  /** Deux panneaux peuvent coexister (ordinateur / téléphone) : identifiants distincts. */
  idPrefix: string;
}) => {
  const id = (name: string) => `${idPrefix}-${name}`;
  const toggleFuel = (fuel: Fuel) =>
    onChange({ carburants: filters.carburants.includes(fuel) ? filters.carburants.filter((f) => f !== fuel) : [...filters.carburants, fuel] });

  return (
    <div className="space-y-5">
      <Group label="Marque" htmlFor={id("marque")}>
        <select id={id("marque")} value={filters.marque} onChange={(e) => onChange({ marque: e.target.value })} className={selectClass}>
          <option value="">Toutes les marques</option>
          {options.makes.map(({ make, count }) => (
            <option key={make} value={make}>
              {make} ({count})
            </option>
          ))}
        </select>
      </Group>

      <Group label="Prix maximum" htmlFor={id("prix")}>
        <select id={id("prix")} value={filters.prixMax ?? ""} onChange={(e) => onChange({ prixMax: Number(e.target.value) || null })} className={selectClass}>
          <option value="">Sans limite</option>
          {filtresPrixMax.map((p) => (
            <option key={p} value={p}>
              Jusqu'à {nf.format(p)} €
            </option>
          ))}
        </select>
      </Group>

      <div className="grid grid-cols-2 gap-3">
        <Group label="Année min." htmlFor={id("annee")}>
          <select id={id("annee")} value={filters.anneeMin ?? ""} onChange={(e) => onChange({ anneeMin: Number(e.target.value) || null })} className={selectClass}>
            <option value="">Toutes</option>
            {options.years.map((y) => (
              <option key={y} value={y}>
                {y} et +
              </option>
            ))}
          </select>
        </Group>
        <Group label="Km max." htmlFor={id("km")}>
          <select id={id("km")} value={filters.kmMax ?? ""} onChange={(e) => onChange({ kmMax: Number(e.target.value) || null })} className={selectClass}>
            <option value="">Sans limite</option>
            {filtresKmMax.map((k) => (
              <option key={k} value={k}>
                {nf.format(k)} km
              </option>
            ))}
          </select>
        </Group>
      </div>

      {options.fuels.length > 0 && (
        <Group label="Carburant">
          <div className="flex flex-wrap gap-2">
            {options.fuels.map((fuel) => (
              <Chip key={fuel} active={filters.carburants.includes(fuel)} onClick={() => toggleFuel(fuel)}>
                {FUEL_LABELS[fuel]}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      {options.gearboxes.length > 0 && (
        <Group label="Boîte de vitesses">
          <div className="flex flex-wrap gap-2">
            {options.gearboxes.map((g) => (
              <Chip key={g} active={filters.boite === g} onClick={() => onChange({ boite: filters.boite === g ? "" : g })}>
                {GEARBOX_LABELS[g]}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      <label className="flex items-center gap-3 min-h-[44px] cursor-pointer text-sm">
        <input type="checkbox" checked={filters.vendus} onChange={(e) => onChange({ vendus: e.target.checked })} className="w-5 h-5 accent-neon-purple" />
        {occasionsTextes.afficherVendus}
      </label>
    </div>
  );
};

export default VehicleFiltersPanel;
