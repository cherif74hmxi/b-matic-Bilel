// ============================================================================
//  useAdminSession — session Supabase + vérification du rôle admin
// ----------------------------------------------------------------------------
//  La session est conservée par Supabase (localStorage, « rester connecté »)
//  et rafraîchie automatiquement. Le rôle admin est vérifié via la fonction
//  SQL public.is_admin() (présence dans la table public.admins).
//
//  ⚠️  Cette vérification ne sert qu'à l'affichage : la vraie protection des
//  données est assurée par les règles RLS de supabase/schema.sql.
// ============================================================================
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminStatus = "loading" | "signedOut" | "notAdmin" | "admin" | "error";

interface AdminSessionValue {
  status: AdminStatus;
  user: User | null;
  /** Renvoie un message d'erreur en français, ou null si la connexion a réussi. */
  signIn: (email: string, password: string) => Promise<string | null>;
  /** Renvoie false si la déconnexion a échoué (hors ligne…). */
  signOut: () => Promise<boolean>;
  /** Relance la vérification admin (après une erreur réseau). */
  recheck: () => void;
}

type AdminCheck = { userId: string; result: "admin" | "notAdmin" | "error" };

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  // undefined = session pas encore connue (premier rendu)
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [adminCheck, setAdminCheck] = useState<AdminCheck | null>(null);
  const [checkNonce, setCheckNonce] = useState(0);

  // onAuthStateChange émet INITIAL_SESSION à l'abonnement, puis chaque
  // connexion / déconnexion / rafraîchissement de jeton.
  useEffect(() => {
    // On garde l'objet précédent si l'utilisateur n'a pas changé (rafraîchissement
    // de jeton ~1 h, autres onglets) pour ne pas re-rendre tout l'admin.
    const { data } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession((prev) =>
        prev && s && prev.user.id === s.user.id && prev.user.email === s.user.email ? prev : s,
      ),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  // Vérification admin une fois par utilisateur (pas à chaque rafraîchissement de jeton).
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (cancelled) return;
      setAdminCheck({ userId, result: error ? "error" : data === true ? "admin" : "notAdmin" });
    });
    return () => {
      cancelled = true;
    };
  }, [userId, checkNonce]);

  const signIn = useCallback(async (email: string, password: string) => {
    let error;
    try {
      ({ error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }));
    } catch {
      return "Connexion impossible pour le moment. Réessayez.";
    }
    if (!error) return null;
    if (error.code === "invalid_credentials") return "E-mail ou mot de passe incorrect.";
    if (error.code === "email_not_confirmed") return "Adresse e-mail non confirmée.";
    if (error.status === 429) return "Trop de tentatives. Réessayez dans quelques minutes.";
    return "Connexion impossible pour le moment. Vérifiez votre connexion internet.";
  }, []);

  // Hors ligne, Supabase conserve la session (même en scope « local », il
  // contacte le serveur) : on le signale à l'appelant au lieu d'échouer en silence.
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch {
      return false;
    }
  }, []);

  const recheck = useCallback(() => {
    setAdminCheck(null);
    setCheckNonce((n) => n + 1);
  }, []);

  let status: AdminStatus;
  if (session === undefined) status = "loading";
  else if (!session) status = "signedOut";
  else if (!adminCheck || adminCheck.userId !== userId) status = "loading";
  else status = adminCheck.result;

  const user = session?.user ?? null;
  const value = useMemo(
    () => ({ status, user, signIn, signOut, recheck }),
    [status, user, signIn, signOut, recheck],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useAdminSession doit être utilisé dans <AdminSessionProvider>.");
  return ctx;
}
