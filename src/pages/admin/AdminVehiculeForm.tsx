import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Info, Loader2, ScanLine, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import { Field, FormSection } from "@/components/admin/FormParts";
import { adminInputClass, adminSelectClass, adminTextareaClass } from "@/components/admin/formStyles";
import { VehicleActionsMenu, VehicleStatusBadge } from "@/components/admin/VehicleActions";
import { AdminLoading } from "@/components/admin/RequireAdmin";
import { vehiculesData } from "@/data/vehicules";
import {
  createVehicle,
  FUEL_LABELS,
  GEARBOX_LABELS,
  getVehicle,
  listVehiclePhotos,
  slugify,
  updateVehicle,
  type Fuel,
  type Gearbox,
  type Vehicle,
  type VehicleInput,
} from "@/lib/vehicles";
import { decodeVin, normalizeVin, VIN_PATTERN, type VinSuggestion } from "@/lib/vin";
import { guardLinkClick, setUnsaved } from "@/lib/unsavedChanges";

// ============================================================================
//  Ajout / édition d'un véhicule (admin)
//  /admin/vehicules/nouveau  → création (brouillon), puis redirection vers
//  /admin/vehicules/:id      → édition (+ photos, étape suivante)
// ============================================================================

const CURRENT_YEAR = new Date().getFullYear();
const FUELS = Object.keys(FUEL_LABELS) as Fuel[];
const GEARBOXES = Object.keys(GEARBOX_LABELS) as Gearbox[];

/**
 * « 12 500 » → 12500 ; vide → null ; invalide → NaN. Le point n'est PAS accepté
 * comme séparateur de milliers : « 110.5 » doit être refusé, pas lu 1105.
 */
function toInt(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, ""); // \s couvre aussi les espaces insécables
  if (cleaned === "") return null;
  return /^\d+$/.test(cleaned) ? Number(cleaned) : NaN;
}

const intField = (min: number, max: number, message: string) =>
  z.string().refine((v) => {
    const n = toInt(v);
    return n === null || (Number.isFinite(n) && n >= min && n <= max);
  }, message);

const schema = z.object({
  vin: z
    .string()
    .refine((v) => v.trim() === "" || VIN_PATTERN.test(normalizeVin(v)), "VIN invalide : 17 caractères, sans I, O ni Q."),
  make: z.string().trim().min(1, "Indiquez la marque.").max(60, "60 caractères maximum."),
  model: z.string().trim().min(1, "Indiquez le modèle.").max(80, "80 caractères maximum."),
  version: z.string().trim().max(120, "120 caractères maximum."),
  year: intField(1950, CURRENT_YEAR + 1, `Année entre 1950 et ${CURRENT_YEAR + 1}.`),
  mileage_km: intField(0, 2_000_000, "Kilométrage invalide : nombre entier, sans point."),
  fuel: z.union([z.literal(""), z.enum(FUELS as [Fuel, ...Fuel[]])]),
  gearbox: z.union([z.literal(""), z.enum(GEARBOXES as [Gearbox, ...Gearbox[]])]),
  power_hp: intField(1, 2000, "Puissance invalide : nombre entier en ch."),
  price_eur: intField(0, 10_000_000, "Prix invalide : nombre entier en euros, sans point ni centimes."),
  title: z.string().trim().min(1, "Indiquez un titre.").max(200, "200 caractères maximum."),
  slug: z
    .string()
    .trim()
    .max(80, "80 caractères maximum.")
    .refine((v) => v === "" || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v), "Minuscules, chiffres et tirets uniquement."),
  description: z.string().max(10000, "10 000 caractères maximum."),
});

type FormValues = z.infer<typeof schema>;

const str = (v: number | string | null | undefined) => (v === null || v === undefined ? "" : String(v));

const toFormValues = (v?: Vehicle): FormValues => ({
  vin: str(v?.vin),
  make: str(v?.make),
  model: str(v?.model),
  version: str(v?.version),
  year: str(v?.year),
  mileage_km: str(v?.mileage_km),
  fuel: v?.fuel ?? "",
  gearbox: v?.gearbox ?? "",
  power_hp: str(v?.power_hp),
  price_eur: str(v?.price_eur),
  title: str(v?.title),
  slug: str(v?.slug),
  description: str(v?.description),
});

const toInput = (f: FormValues): VehicleInput => {
  const text = (s: string) => s.trim() || null;
  return {
    vin: f.vin.trim() ? normalizeVin(f.vin) : null,
    make: f.make.trim(),
    model: f.model.trim(),
    version: text(f.version),
    year: toInt(f.year),
    mileage_km: toInt(f.mileage_km),
    fuel: f.fuel || null,
    gearbox: f.gearbox || null,
    power_hp: toInt(f.power_hp),
    price_eur: toInt(f.price_eur),
    title: f.title.trim(),
    slug: f.slug.trim() || slugify(f.title),
    description: text(f.description),
  };
};

const SUGGESTION_LABELS: Record<keyof VinSuggestion, string> = {
  make: "marque",
  model: "modèle",
  year: "année",
  version: "version",
  fuel: "carburant",
  gearbox: "boîte",
  power_hp: "puissance",
};

type VinState =
  | { status: "idle" | "loading" | "unknown" | "error" }
  | { status: "done"; filled: string[]; yearFromVin: boolean };

// ---------------------------------------------------------------------------

const VehicleForm = ({ vehicle }: { vehicle?: Vehicle }) => {
  const isNew = !vehicle;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const photos = useQuery({
    queryKey: ["admin", "vehicle-photos", vehicle?.id],
    queryFn: () => listVehiclePhotos(vehicle!.id),
    enabled: Boolean(vehicle),
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(vehicle), mode: "onTouched" });

  // ----- Slug : suit le titre tant qu'il n'a pas été modifié à la main (création seulement)
  const slugTouched = useRef(!isNew);
  const title = watch("title");
  useEffect(() => {
    if (!slugTouched.current) setValue("slug", slugify(title ?? ""), { shouldDirty: true });
  }, [title, setValue]);

  // ----- Décodage VIN (NHTSA vPIC) : remplit uniquement les champs vides
  const [vinState, setVinState] = useState<VinState>({ status: "idle" });
  const lastDecoded = useRef(vehicle?.vin ?? "");
  const decodeAbort = useRef<AbortController | null>(null);

  const proposeTitle = useCallback(() => {
    // Sans l'année : souvent corrigée après le décodage VIN, elle figerait un titre faux.
    const { make, model, version } = getValues();
    const proposal = [make, model, version].map((s) => s.trim()).filter(Boolean).join(" ");
    if (proposal) setValue("title", proposal.slice(0, 200), { shouldDirty: true, shouldValidate: true });
  }, [getValues, setValue]);

  const runDecode = useCallback(
    async (vin: string) => {
      decodeAbort.current?.abort();
      const controller = new AbortController();
      decodeAbort.current = controller;
      lastDecoded.current = vin;
      setVinState({ status: "loading" });

      const suggestion = await decodeVin(vin, controller.signal);
      if (controller.signal.aborted) return;
      if (suggestion === null) return setVinState({ status: "error" });

      const filled: string[] = [];
      for (const [key, value] of Object.entries(suggestion) as [keyof VinSuggestion, string | number][]) {
        if (getValues(key) === "") {
          setValue(key, String(value) as never, { shouldDirty: true, shouldValidate: true });
          filled.push(SUGGESTION_LABELS[key]);
        }
      }
      if (filled.length === 0) {
        setVinState(Object.keys(suggestion).length === 0 ? { status: "unknown" } : { status: "done", filled, yearFromVin: false });
        return;
      }
      if (getValues("title").trim() === "") proposeTitle();
      setVinState({ status: "done", filled, yearFromVin: filled.includes("année") });
    },
    [getValues, setValue, proposeTitle],
  );

  const vinValue = watch("vin");
  useEffect(() => {
    const vin = normalizeVin(vinValue ?? "");
    if (VIN_PATTERN.test(vin) && vin !== lastDecoded.current) void runDecode(vin);
  }, [vinValue, runDecode]);
  useEffect(() => () => decodeAbort.current?.abort(), []);

  // ----- Avertir avant de quitter avec des modifications non enregistrées
  // (liens internes via setUnsaved/confirmLeave, onglet/rechargement via beforeunload)
  useEffect(() => {
    setUnsaved(isDirty);
    return () => setUnsaved(false);
  }, [isDirty]);
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  // ----- Enregistrement
  const save = useMutation({
    mutationFn: (values: FormValues) => {
      const input = toInput(values);
      return vehicle ? updateVehicle(vehicle.id, input) : createVehicle(input);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(["admin", "vehicle", saved.id], saved);
      void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
      reset(toFormValues(saved));
      if (isNew) {
        toast.success("Brouillon enregistré. Ajoutez maintenant les photos.");
        navigate(`/admin/vehicules/${saved.id}`, { replace: true });
      } else {
        toast.success("Modifications enregistrées.");
      }
    },
    onError: () => toast.error("Enregistrement impossible. Vérifiez votre connexion et réessayez."),
  });

  const onSubmit = (values: FormValues) => {
    if (vehicle && vehicle.status !== "draft" && toInt(values.price_eur) === null) {
      toast.error("Une annonce en ligne doit avoir un prix.");
      return;
    }
    save.mutate(values);
  };

  const make = watch("make");
  const models = vehiculesData[Object.keys(vehiculesData).find((m) => m.toLowerCase() === (make ?? "").trim().toLowerCase()) ?? ""] ?? [];
  const HINTED: (keyof FormValues)[] = ["vin", "version", "price_eur", "slug"];
  const fieldProps = (name: keyof FormValues) => ({
    id: `v-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `v-${name}-error` : HINTED.includes(name) ? `v-${name}-hint` : undefined,
    ...register(name),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="pb-28 md:pb-0">
      {/* ---------- En-tête ---------- */}
      <Link to="/admin/vehicules" onClick={guardLinkClick} className="inline-flex items-center gap-2 min-h-[44px] text-sm text-muted-foreground hover:text-foreground mb-2">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Véhicules
      </Link>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="min-w-0">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-gradient-neon break-words">
            {vehicle ? vehicle.title : "Nouveau véhicule"}
          </h1>
          {vehicle && (
            <div className="mt-2">
              <VehicleStatusBadge status={vehicle.status} />
            </div>
          )}
        </div>
        {vehicle && (
          <VehicleActionsMenu
            vehicle={vehicle}
            photoCount={photos.data?.length}
            showEdit={false}
            onDeleted={() => {
              setUnsaved(false);
              navigate("/admin/vehicules", { replace: true });
            }}
          />
        )}
      </div>

      <div className="grid gap-4">
        {/* ---------- Identification ---------- */}
        <FormSection title="Identification">
          <Field
            id="v-vin"
            label="Numéro de châssis (VIN)"
            error={errors.vin?.message}
            hint="17 caractères. Saisissez-le en premier : marque, année… se remplissent automatiquement quand c'est possible."
          >
            <div className="flex gap-2">
              <input
                {...fieldProps("vin")}
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                maxLength={40}
                className={`${adminInputClass} font-mono uppercase tracking-wider`}
              />
              <button
                type="button"
                onClick={() => {
                  const vin = normalizeVin(getValues("vin"));
                  if (VIN_PATTERN.test(vin)) void runDecode(vin);
                  else toast.error("Saisissez un VIN complet (17 caractères).");
                }}
                disabled={vinState.status === "loading"}
                className="btn-ghost shrink-0 min-h-[48px] px-4"
                aria-label="Décoder le VIN"
              >
                {vinState.status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ScanLine className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Décoder</span>
              </button>
            </div>
          </Field>

          <div aria-live="polite">
            {vinState.status === "done" && vinState.filled.length > 0 && (
              <p className="flex gap-2 text-sm rounded-lg border border-neon-cyan/40 bg-neon-cyan/5 p-3">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Pré-rempli depuis le VIN : {vinState.filled.join(", ")}. Vérifiez et complétez.
                  {vinState.yearFromVin && " L'année déduite du VIN est souvent inexacte pour les véhicules européens."}
                </span>
              </p>
            )}
            {vinState.status === "done" && vinState.filled.length === 0 && (
              <p className="flex gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                VIN reconnu, mais les champs concernés sont déjà remplis : rien n'a été modifié.
              </p>
            )}
            {vinState.status === "unknown" && (
              <p className="flex gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                Ce VIN n'est pas reconnu par la base NHTSA (fréquent pour les véhicules européens). Complétez à la main.
              </p>
            )}
            {vinState.status === "error" && (
              <p className="flex gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                Service de décodage indisponible pour le moment. Complétez à la main.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field id="v-make" label="Marque" required error={errors.make?.message}>
              <input {...fieldProps("make")} list="v-make-list" autoComplete="off" className={adminInputClass} />
              <datalist id="v-make-list">
                {Object.keys(vehiculesData).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
            <Field id="v-model" label="Modèle" required error={errors.model?.message}>
              <input {...fieldProps("model")} list="v-model-list" autoComplete="off" className={adminInputClass} />
              <datalist id="v-model-list">
                {models.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
          </div>
          <Field id="v-version" label="Version / finition" error={errors.version?.message} hint="Ex. 1.6 TDI Highline">
            <input {...fieldProps("version")} autoComplete="off" className={adminInputClass} />
          </Field>
        </FormSection>

        {/* ---------- Caractéristiques ---------- */}
        <FormSection title="Caractéristiques">
          <div className="grid grid-cols-2 gap-3">
            <Field id="v-year" label="Année" error={errors.year?.message}>
              <input {...fieldProps("year")} inputMode="numeric" autoComplete="off" maxLength={4} className={adminInputClass} />
            </Field>
            <Field id="v-mileage_km" label="Kilométrage (km)" error={errors.mileage_km?.message}>
              <input {...fieldProps("mileage_km")} inputMode="numeric" autoComplete="off" className={adminInputClass} />
            </Field>
            <Field id="v-fuel" label="Carburant" error={errors.fuel?.message}>
              <select {...fieldProps("fuel")} className={adminSelectClass}>
                <option value="">—</option>
                {FUELS.map((f) => (
                  <option key={f} value={f}>
                    {FUEL_LABELS[f]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="v-gearbox" label="Boîte" error={errors.gearbox?.message}>
              <select {...fieldProps("gearbox")} className={adminSelectClass}>
                <option value="">—</option>
                {GEARBOXES.map((g) => (
                  <option key={g} value={g}>
                    {GEARBOX_LABELS[g]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="v-power_hp" label="Puissance (ch)" error={errors.power_hp?.message}>
              <input {...fieldProps("power_hp")} inputMode="numeric" autoComplete="off" className={adminInputClass} />
            </Field>
          </div>
        </FormSection>

        {/* ---------- Annonce ---------- */}
        <FormSection title="Annonce">
          <Field id="v-price_eur" label="Prix (€)" error={errors.price_eur?.message} hint="Obligatoire pour publier.">
            <input {...fieldProps("price_eur")} inputMode="numeric" autoComplete="off" className={adminInputClass} />
          </Field>
          <Field id="v-title" label="Titre de l'annonce" required error={errors.title?.message}>
            <input {...fieldProps("title")} autoComplete="off" className={adminInputClass} />
          </Field>
          <button type="button" onClick={proposeTitle} className="btn-ghost min-h-[44px] w-full sm:w-auto -mt-1">
            <WandSparkles className="w-4 h-4" aria-hidden="true" />
            Titre depuis marque / modèle
          </button>
          <Field
            id="v-slug"
            label="Adresse de la page"
            error={errors.slug?.message}
            hint={
              vehicle?.status === "published"
                ? "Attention : changer l'adresse d'une annonce en ligne casse les liens déjà partagés."
                : "Générée depuis le titre. Si elle existe déjà, un numéro est ajouté."
            }
          >
            <div className="flex items-center rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/50">
              <span className="pl-4 text-sm text-muted-foreground shrink-0">/vehicules/</span>
              <input
                {...fieldProps("slug")}
                onChange={(e) => {
                  slugTouched.current = true;
                  void register("slug").onChange(e);
                }}
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 min-h-[48px] bg-transparent pr-4 pl-1 text-base font-mono focus:outline-none"
              />
            </div>
          </Field>
          <Field id="v-description" label="Description" error={errors.description?.message}>
            <textarea {...fieldProps("description")} rows={8} className={adminTextareaClass} />
          </Field>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-neon-purple shrink-0" aria-hidden="true" />
            L'assistant IA (titre + description) arrive à l'étape suivante.
          </p>
        </FormSection>

        {isNew && (
          <p className="flex gap-2 text-sm text-muted-foreground px-1">
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            Le véhicule est d'abord enregistré en brouillon (invisible sur le site). Vous pourrez ensuite ajouter les photos et le
            publier.
          </p>
        )}
      </div>

      {/* ---------- Barre d'enregistrement (fixe au-dessus des onglets sur mobile) ---------- */}
      <div className="fixed md:sticky inset-x-0 bottom-[calc(56px+env(safe-area-inset-bottom))] md:bottom-4 z-30 mt-6 border-t md:border border-border bg-background/95 backdrop-blur-xl px-4 py-3 md:rounded-xl md:px-4">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {isDirty ? "Modifications non enregistrées" : "Tout est enregistré"}
          </span>
          <button type="submit" disabled={save.isPending || (!isNew && !isDirty)} className="btn-main min-h-[48px] w-full sm:w-auto">
            {save.isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {isNew ? "Enregistrer le brouillon" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------

const AdminVehiculeForm = () => {
  const { id } = useParams();
  const vehicle = useQuery({ queryKey: ["admin", "vehicle", id], queryFn: () => getVehicle(id!), enabled: Boolean(id) });
  useSeo({ title: `${id ? vehicle.data?.title ?? "Véhicule" : "Nouveau véhicule"} — Admin B MATIC` });

  if (id && vehicle.isLoading) return <AdminLoading />;
  if (id && (vehicle.isError || !vehicle.data)) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Véhicule introuvable ou chargement impossible.</p>
        <Link to="/admin/vehicules" className="btn-ghost min-h-[44px]">
          Retour à la liste
        </Link>
      </div>
    );
  }
  // key : formulaire réinitialisé quand on passe d'un véhicule à un autre.
  return <VehicleForm key={id ?? "new"} vehicle={vehicle.data} />;
};

export default AdminVehiculeForm;
