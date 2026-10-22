// ============================================================================
//  Rédaction assistée (Gemini) — appel de l'Edge Function « generate-copy »
//  La clé Gemini reste un secret Supabase : le navigateur n'envoie que le JWT
//  de l'admin connecté et les caractéristiques du véhicule / le sujet de l'actu.
//  Activation : VITE_AI_ENABLED=true dans .env, une fois la fonction déployée.
// ============================================================================
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";

export const AI_ENABLED = import.meta.env.VITE_AI_ENABLED === "true";

/** Longueurs maximales acceptées par l'Edge Function (à garder identiques). */
export const AI_LIMITS = { notes: 10_000, draft: 20_000 } as const;

export interface VehicleCopyInput {
  make: string;
  model: string;
  version?: string;
  year?: number;
  mileage_km?: number;
  fuel?: string;
  gearbox?: string;
  power_hp?: number;
  price_eur?: number;
  /** Notes libres du garage (ex. description déjà saisie), reformulées sans rien inventer. */
  notes?: string;
}

export interface PostCopyInput {
  topic: string;
  draft?: string;
}

/** Champs vides acceptés (null) : retirés avant l'envoi. */
type Nullable<T> = { [K in keyof T]: T[K] | null };

export type CopyRequest = { kind: "vehicle"; data: Nullable<VehicleCopyInput> } | { kind: "post"; data: Nullable<PostCopyInput> };

export interface GeneratedCopy {
  title: string;
  description: string;
  /** Suggestion d'adresse (l'adresse automatique reste la valeur par défaut). */
  slug?: string;
}

/** Supprime les champs vides (null, undefined, "") avant l'envoi. */
const compact = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "")) as T;

export async function generateCopy(request: CopyRequest): Promise<GeneratedCopy> {
  const { data, error } = await supabase.functions.invoke<GeneratedCopy>("generate-copy", {
    body: { kind: request.kind, data: compact(request.data) },
  });
  if (error) {
    // Message en français renvoyé par la fonction (401, 403, 400, 502…), sinon message générique.
    let message = "Assistant IA indisponible pour le moment. Réessayez dans un instant.";
    if (error instanceof FunctionsHttpError) {
      try {
        const body = (await error.context.json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // corps illisible : message générique
      }
    }
    throw new Error(message);
  }
  if (!data?.title || !data.description) throw new Error("Réponse de l'assistant incomplète. Réessayez.");
  // L'adresse proposée repasse par la règle du site (la fonction en garde une copie côté Deno).
  return { ...data, slug: data.slug ? slugify(data.slug) || undefined : undefined };
}

/** Appel de l'assistant avec messages (succès / erreur) communs aux formulaires admin. */
export function useAiCopy(apply: (copy: GeneratedCopy) => void) {
  const mutation = useMutation({
    mutationFn: generateCopy,
    onSuccess: (copy) => {
      apply(copy);
      toast.success("Proposition insérée : relisez-la et ajustez-la avant d'enregistrer.");
    },
    onError: (error) => toast.error(error.message),
  });
  return { generate: mutation.mutate, pending: mutation.isPending };
}
