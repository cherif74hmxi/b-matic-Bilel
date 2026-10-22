import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Info, Loader2, Pencil, ScanLine, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import useSeo from "@/hooks/useSeo";
import { Field, FormSection } from "@/components/admin/FormParts";
import { adminInputClass, adminSelectClass, adminTextareaClass } from "@/components/admin/formStyles";
import { VehicleActionsMenu, VehicleStatusBadge } from "@/components/admin/VehicleActions";
import { AdminLoading } from "@/components/admin/RequireAdmin";
import VehiclePhotos, { StagedVehiclePhotos, type StagedPhoto } from "@/components/admin/VehiclePhotos";
import { stashUploads } from "@/lib/stagedUploads";
import AiAssistButton, { SlugSuggestion } from "@/components/admin/AiAssistButton";
import SaveBar from "@/components/admin/SaveBar";
import { AI_LIMITS, useAiCopy } from "@/lib/aiCopy";
import { vehiculesData } from "@/data/vehicules";
import {
  createVehicle,
  FUEL_LABELS,
  GEARBOX_LABELS,
  getVehicle,
  listVehiclePhotos,
  publishBlocker,
  slugify,
  updateVehicle,
  type Fuel,
  type Gearbox,
  type Vehicle,
  type VehicleInput,
} from "@/lib/vehicles";
import { decodeVin, normalizeVin, VIN_PATTERN, type VinSuggestion } from "@/lib/vin";
import { guardLinkClick, setUnsaved, useLeaveGuard } from "@/lib/unsavedChanges";

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
  // Jamais bloquant : un VIN incomplet n'empêche pas d'enregistrer (il n'est simplement pas gardé).
  vin: z.string(),
  make: z.string().trim().min(1, "Indiquez la marque.").max(60, "60 caractères maximum."),
  model: z.string().trim().min(1, "Indiquez le modèle.").max(80, "80 caractères maximum."),
  version: z.string().trim().max(120, "120 caractères maximum."),
  year: intField(1950, CURRENT_YEAR + 1, `Année entre 1950 et ${CURRENT_YEAR + 1}.`),
  mileage_km: intField(0, 2_000_000, "Kilométrage invalide : nombre entier, sans point."),
  fuel: z.union([z.literal(""), z.enum(FUELS as [Fuel, ...Fuel[]])]),
  gearbox: z.union([z.literal(""), z.enum(GEARBOXES as [Gearbox, ...Gearbox[]])]),
  power_hp: intField(1, 2000, "Puissance invalide : nombre entier en ch."),
  price_eur: intField(0, 10_000_000, "Prix invalide : nombre entier en euros, sans point ni centimes."),
  // Facultatif : généré depuis marque / modèle / version s'il est vide.
  title: z.string().trim().max(200, "200 caractères maximum."),
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

/** Titre par défaut : « Marque Modèle Version ». */
const autoTitle = (f: Pick<FormValues, "make" | "model" | "version">) =>
  [f.make, f.model, f.version].map((s) => s.trim()).filter(Boolean).join(" ").slice(0, 200);

/** Adresse par défaut : marque-modèle-année (SEO). */
const autoSlug = (f: Pick<FormValues, "make" | "model" | "year">) => slugify([f.make, f.model, f.year].map((s) => s.trim()).filter(Boolean).join(" "));

const toInput = (f: FormValues): VehicleInput => {
  const text = (s: string) => s.trim() || null;
  const vin = normalizeVin(f.vin);
  return {
    vin: VIN_PATTERN.test(vin) ? vin : null,
    make: f.make.trim(),
    model: f.model.trim(),
    version: text(f.version),
    year: toInt(f.year),
    mileage_km: toInt(f.mileage_km),
    fuel: f.fuel || null,
    gearbox: f.gearbox || null,
    power_hp: toInt(f.power_hp),
    price_eur: toInt(f.price_eur),
    title: f.title.trim() || autoTitle(f),
    slug: f.slug.trim() || autoSlug(f),
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
  | { status: "idle" | "loading" }
  | {
      status: "done";
      /** Champs vides remplis par le décodage. */
      filled: string[];
      /** Le décodage a trouvé au moins une information (même déjà saisie). */
      found: boolean;
      /** Données partielles (pas de modèle) : cas fréquent des véhicules européens. */
      limited: boolean;
      serviceDown: boolean;
      /** Année proposée par vPIC mais écartée (peu fiable pour ce VIN). */
      yearSkipped: boolean;
    };

/** Résultat du décodage VIN, sans jamais présenter une donnée absente comme trouvée. */
const VinMessage = ({ state }: { state: Extract<VinState, { status: "done" }> }) => {
  const { filled, found, limited, serviceDown, yearSkipped } = state;
  const rest = "Complétez le reste à la main à partir de la carte grise.";
  const yearNote = yearSkipped ? " L'année n'a pas été reprise : elle n'est pas fiable dans ce VIN (voir la carte grise)." : "";
  if (!found) {
    return (
      <p className="flex gap-2 text-sm rounded-lg border border-border bg-muted/30 p-3">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {serviceDown
            ? "Service de décodage indisponible pour le moment."
            : "Aucune information trouvée pour ce VIN (fréquent pour les véhicules européens)."}{" "}
          Complétez à la main à partir de la carte grise.{yearNote}
        </span>
      </p>
    );
  }
  if (filled.length === 0 && !serviceDown) {
    return (
      <p className="flex gap-2 text-sm text-muted-foreground">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        Les informations trouvées sont déjà remplies : rien n'a été modifié.{yearNote}
      </p>
    );
  }
  return (
    <p className="flex gap-2 text-sm rounded-lg border border-neon-cyan/40 bg-neon-cyan/5 p-3">
      <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" aria-hidden="true" />
      <span>
        {filled.length > 0 ? `Pré-rempli depuis le VIN : ${filled.join(", ")}. Vérifiez. ` : "Marque déjà remplie. "}
        {serviceDown
          ? `Service de décodage indisponible : seule la marque a été déduite du VIN. ${rest}`
          : limited
            ? `Données limitées pour ce VIN (fréquent pour les véhicules européens). ${rest}`
            : "Complétez si besoin."}
        {yearNote}
      </span>
    </p>
  );
};

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
  // Nouveau véhicule : photos choisies avant l'enregistrement (envoyées ensuite).
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  // Lu à la fin de l'enregistrement : onSuccess garde sinon la liste du moment du clic.
  const stagedRef = useRef(staged);
  stagedRef.current = staged;

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toFormValues(vehicle), mode: "onTouched" });

  // ----- Adresse : marque-modèle-année tant qu'elle n'a pas été modifiée à la main
  // (brouillons uniquement). Après la première publication elle est figée : la
  // changer reste possible (bouton dédié), une redirection est alors créée en base.
  // Brouillon existant dont l'adresse a été choisie à la main : on ne l'écrase pas.
  const slugTouched = useRef(Boolean(vehicle && (vehicle.published_at || vehicle.slug !== autoSlug(toFormValues(vehicle)))));
  const [slugUnlocked, setSlugUnlocked] = useState(false);
  const slugLocked = Boolean(vehicle?.published_at) && !slugUnlocked;
  const [makeW, modelW, yearW] = watch(["make", "model", "year"]);
  useEffect(() => {
    if (!slugTouched.current) setValue("slug", autoSlug({ make: makeW ?? "", model: modelW ?? "", year: yearW ?? "" }), { shouldDirty: true });
  }, [makeW, modelW, yearW, setValue]);
  const unlockSlug = () => {
    if (
      window.confirm(
        "Cette annonce a déjà été publiée : son adresse est figée pour ne pas casser les liens partagés. La changer quand même ? (l'ancienne adresse redirigera vers la nouvelle)",
      )
    )
      setSlugUnlocked(true);
  };

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

      const { suggestion, serviceDown, yearSkipped } = await decodeVin(vin, controller.signal);
      if (controller.signal.aborted) return;

      const filled: string[] = [];
      for (const [key, value] of Object.entries(suggestion) as [keyof VinSuggestion, string | number][]) {
        if (getValues(key) === "") {
          setValue(key, String(value) as never, { shouldDirty: true, shouldValidate: true });
          filled.push(SUGGESTION_LABELS[key]);
        }
      }
      if (filled.length > 0 && getValues("title").trim() === "") proposeTitle();
      const found = Object.keys(suggestion).length > 0;
      setVinState({ status: "done", filled, found, limited: found && !suggestion.model, serviceDown, yearSkipped });
    },
    [getValues, setValue, proposeTitle],
  );

  const vinValue = watch("vin");
  const vinLength = normalizeVin(vinValue ?? "").length;
  useEffect(() => {
    const raw = vinValue ?? "";
    // O, Q et I n'existent pas dans un VIN : corrigés dans le champ, visiblement.
    if (/[oqi]/i.test(raw)) {
      setValue("vin", raw.replace(/[oq]/gi, "0").replace(/i/gi, "1"), { shouldDirty: true });
      toast.info("Un VIN ne contient jamais O, Q ni I : remplacés par 0 et 1.", { id: "vin-letters" });
      return;
    }
    const vin = normalizeVin(raw);
    if (VIN_PATTERN.test(vin) && vin !== lastDecoded.current) void runDecode(vin);
  }, [vinValue, runDecode, setValue]);
  useEffect(() => () => decodeAbort.current?.abort(), []);

  // ----- Avertir avant de quitter avec des modifications non enregistrées
  // (liens internes via setUnsaved/confirmLeave, onglet/rechargement via beforeunload)
  const hasUnsaved = isDirty || staged.length > 0;
  useLeaveGuard(hasUnsaved);

  // ----- Assistant IA : titre + description à partir des caractéristiques saisies
  // (titre et description verrouillés pendant la rédaction : la réponse les remplace)
  const [aiSlug, setAiSlug] = useState<string | null>(null);
  const ai = useAiCopy(({ title, description, slug }) => {
    setAiSlug(slug && slug !== getValues("slug") ? slug : null);
    setValue("title", title.slice(0, 200), { shouldDirty: true, shouldValidate: true });
    setValue("description", description.slice(0, AI_LIMITS.notes), { shouldDirty: true, shouldValidate: true });
  });
  const runAi = async () => {
    const valid = await trigger(["make", "model", "version", "year", "mileage_km", "power_hp", "price_eur"]);
    if (!valid) return void toast.error("Corrigez d'abord les champs signalés en rouge.");
    const i = toInput(getValues());
    if (!i.make || !i.model) return void toast.error("Indiquez au moins la marque et le modèle.");
    if (i.description && !window.confirm("Remplacer le titre et la description par la proposition de l'IA ? Votre description lui sert de base."))
      return;
    ai.generate({
      kind: "vehicle",
      data: {
        make: i.make,
        model: i.model,
        version: i.version,
        year: i.year,
        mileage_km: i.mileage_km,
        fuel: i.fuel && FUEL_LABELS[i.fuel],
        gearbox: i.gearbox && GEARBOX_LABELS[i.gearbox],
        power_hp: i.power_hp,
        price_eur: i.price_eur,
        notes: i.description?.slice(0, AI_LIMITS.notes) ?? null,
      },
    });
  };

  // ----- Enregistrement
  const save = useMutation({
    mutationFn: ({ values, publish }: { values: FormValues; publish: boolean }) => {
      const input = toInput(values);
      // VIN saisi mais incomplet : on garde celui déjà enregistré plutôt que de l'effacer.
      if (vehicle && input.vin === null && normalizeVin(values.vin)) input.vin = vehicle.vin;
      // Nouveau : publié après l'envoi des photos (ou tout de suite s'il n'y en a pas à envoyer).
      if (!vehicle) return createVehicle(input).then((v) => (publish && stagedRef.current.length === 0 ? updateVehicle(v.id, { status: "published" }) : v));
      const { slug, ...rest } = input;
      // Adresse inchangée : pas de vérification d'unicité (et pas de redirection inutile).
      const patch = slug === vehicle.slug ? rest : input;
      return updateVehicle(vehicle.id, publish ? { ...patch, status: "published" } : patch);
    },
    onSuccess: (saved, { publish }) => {
      queryClient.setQueryData(["admin", "vehicle", saved.id], saved);
      void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
      reset(toFormValues(saved));
      if (isNew) {
        // Les photos en attente partent avec la page d'édition (envoi automatique).
        const files = stagedRef.current.map(({ file, slot }) => ({ file, slot }));
        stashUploads(saved.id, files, publish);
        // Nouveau véhicule = aucune photo en base : la galerie s'affiche (et envoie) sans attendre de requête.
        queryClient.setQueryData(["admin", "vehicle-photos", saved.id], []);
        toast.success(
          publish ? "Véhicule enregistré. Envoi des photos, puis mise en ligne…" : files.length > 0 ? "Brouillon enregistré. Envoi des photos…" : "Brouillon enregistré.",
        );
        setUnsaved(false);
        navigate(`/admin/vehicules/${saved.id}`, { replace: true });
      } else {
        setSlugUnlocked(false);
        toast.success(publish ? "Annonce publiée sur le site." : "Modifications enregistrées.");
      }
    },
    onError: () => toast.error("Enregistrement impossible. Vérifiez votre connexion et réessayez."),
  });

  // Publication automatique d'un nouveau véhicule, une fois ses photos envoyées.
  const publishAfterUpload = useCallback(() => {
    if (!vehicle) return;
    updateVehicle(vehicle.id, { status: "published" })
      .then((saved) => {
        queryClient.setQueryData<Vehicle>(["admin", "vehicle", saved.id], (old) => (old ? { ...old, status: saved.status, published_at: saved.published_at } : saved));
        void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
        void queryClient.invalidateQueries({ queryKey: ["admin", "kpis"] });
        toast.success("Photos envoyées : annonce publiée sur le site.");
      })
      .catch(() => toast.error("Photos envoyées, mais la mise en ligne a échoué. Utilisez « Publier »."));
  }, [vehicle, queryClient]);

  const onSubmit = (values: FormValues, publish: boolean) => {
    const raw = normalizeVin(values.vin);
    if (raw && !VIN_PATTERN.test(raw))
      toast.info(
        vehicle?.vin
          ? "VIN incomplet : le VIN déjà enregistré est conservé (17 caractères, carte grise case E)."
          : "VIN incomplet : il n'est pas enregistré (17 caractères, carte grise case E).",
      );
    // Publication : prix + au moins une photo. Annonce déjà en ligne : le prix suffit
    // (une annonce vendue n'est pas vérifiée, elle n'est plus « à vendre »).
    if (publish || vehicle?.status === "published") {
      const photoCount = !publish ? Infinity : vehicle ? photos.data?.length : stagedRef.current.length;
      const blocker = publishBlocker({ price_eur: toInt(values.price_eur) }, photoCount);
      if (blocker) return void toast.error(blocker);
    }
    save.mutate({ values, publish });
  };
  const pendingAction = save.isPending ? (save.variables?.publish ? "publish" : "draft") : null;
  const canPublish = !vehicle || vehicle.status === "draft";

  const make = watch("make");
  const models = vehiculesData[Object.keys(vehiculesData).find((m) => m.toLowerCase() === (make ?? "").trim().toLowerCase()) ?? ""] ?? [];
  const HINTED: (keyof FormValues)[] = ["vin", "version", "price_eur", "title", "slug"];
  const fieldProps = (name: keyof FormValues) => ({
    id: `v-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `v-${name}-error` : HINTED.includes(name) ? `v-${name}-hint` : undefined,
    ...register(name),
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, false))} noValidate className="pb-28 md:pb-0">
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
            hint={`${vinLength}/17 — Le VIN fait toujours 17 caractères (carte grise, case E) — le décodage est optionnel.`}
          >
            {/* Mobile : bouton sous le champ, pour que les 17 caractères restent lisibles. */}
            <div className="flex flex-wrap gap-2">
              <input
                {...fieldProps("vin")}
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                maxLength={40}
                className={`${adminInputClass} flex-1 basis-60 font-mono uppercase tracking-wider`}
              />
              <button
                type="button"
                onClick={() => {
                  const vin = normalizeVin(getValues("vin"));
                  if (VIN_PATTERN.test(vin)) void runDecode(vin);
                  else toast.error(`${vin.length < 17 ? "VIN incomplet" : "VIN trop long"} : ${vin.length}/17 caractères.`);
                }}
                disabled={vinState.status === "loading"}
                className="btn-ghost flex-1 sm:flex-none min-h-[48px] px-4"
                aria-label="Décoder le VIN"
              >
                {vinState.status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ScanLine className="w-4 h-4" aria-hidden="true" />
                )}
                Décoder
              </button>
            </div>
          </Field>

          <div aria-live="polite">
            {vinState.status === "done" && <VinMessage state={vinState} />}
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

        {/* ---------- Photos ---------- */}
        {!vehicle ? (
          <FormSection title="Photos">
            <StagedVehiclePhotos items={staged} onChange={setStaged} disabled={save.isPending} />
          </FormSection>
        ) : (
          <FormSection title="Photos">
            {photos.isError ? (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-neon-pink">Chargement des photos impossible.</span>
                <button type="button" onClick={() => void photos.refetch()} className="btn-ghost min-h-[44px] px-4">
                  Réessayer
                </button>
              </div>
            ) : photos.data ? (
              <VehiclePhotos vehicleId={vehicle.id} vehicleTitle={vehicle.title} photos={photos.data} onBatchPublish={publishAfterUpload} />
            ) : (
              <div className="h-40 rounded-xl bg-muted/40 animate-pulse" />
            )}
          </FormSection>
        )}

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
          <Field id="v-title" label="Titre de l'annonce" error={errors.title?.message} hint="Laissé vide : « Marque Modèle Version ».">
            <input {...fieldProps("title")} readOnly={ai.pending} autoComplete="off" className={adminInputClass} />
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
              slugLocked
                ? "Adresse figée depuis la publication (les liens partagés restent valables)."
                : vehicle?.published_at
                  ? "L'ancienne adresse redirigera vers la nouvelle."
                  : "Générée depuis marque, modèle et année. Modifiable jusqu'à la publication."
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
                readOnly={slugLocked}
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                className={`flex-1 min-w-0 min-h-[48px] bg-transparent pr-4 pl-1 text-base font-mono focus:outline-none ${slugLocked ? "text-muted-foreground" : ""}`}
              />
            </div>
          </Field>
          {!slugLocked && aiSlug && (
            <SlugSuggestion
              prefix="/vehicules/"
              slug={aiSlug}
              onUse={() => {
                slugTouched.current = true;
                setValue("slug", aiSlug, { shouldDirty: true, shouldValidate: true });
                setAiSlug(null);
              }}
            />
          )}
          {slugLocked && (
            <button type="button" onClick={unlockSlug} className="btn-ghost min-h-[44px] w-full sm:w-auto -mt-1">
              <Pencil className="w-4 h-4" aria-hidden="true" />
              Modifier l'adresse
            </button>
          )}
          <Field id="v-description" label="Description" error={errors.description?.message}>
            <textarea {...fieldProps("description")} readOnly={ai.pending} rows={8} className={adminTextareaClass} />
          </Field>
          <AiAssistButton
            onClick={() => void runAi()}
            pending={ai.pending}
            hint="Rédige le titre et la description à partir des caractéristiques saisies (rien n'est inventé). Relisez avant d'enregistrer."
          />
        </FormSection>

        {isNew && (
          <p className="flex gap-2 text-sm text-muted-foreground px-1">
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            Le véhicule est enregistré en brouillon (invisible sur le site) avec ses photos. Vous pourrez ensuite le publier.
          </p>
        )}
      </div>

      {/* ---------- Barre d'enregistrement (fixe au-dessus des onglets sur mobile) ---------- */}
      <SaveBar
        status={hasUnsaved ? "Modifications non enregistrées" : "Tout est enregistré"}
        pending={pendingAction}
        canPublish={canPublish}
        saveDisabled={!isNew && !isDirty}
        onPublish={() => void handleSubmit((values) => onSubmit(values, true))()}
      />
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
