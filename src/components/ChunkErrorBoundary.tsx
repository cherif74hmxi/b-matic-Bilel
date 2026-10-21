import { Component, ReactNode } from "react";

// ============================================================================
//  ChunkErrorBoundary — filet de sécurité autour d'un chunk chargé en différé
//  (ex. espace admin) : chunk introuvable après un redéploiement, Supabase non
//  configuré… Affiche un message en français au lieu d'une page blanche.
// ============================================================================

interface State {
  failed: boolean;
}

class ChunkErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4 font-body">
        <div className="w-full max-w-sm bg-gradient-card border-glow rounded-xl p-6 text-center glow-card">
          <h1 className="font-heading text-lg font-bold mb-2">Chargement impossible</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Cette page n'a pas pu se charger. Vérifiez votre connexion puis réessayez.
          </p>
          <button type="button" onClick={() => window.location.reload()} className="btn-main w-full min-h-[44px]">
            Recharger la page
          </button>
        </div>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
