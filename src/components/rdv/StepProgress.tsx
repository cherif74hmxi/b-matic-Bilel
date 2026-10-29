// ============================================================================
//  StepProgress — barre de progression du formulaire de rendez-vous
//  « Étape 2 sur 6 · Véhicule » + barre en dégradé néon.
// ============================================================================

const StepProgress = ({ step, labels }: { step: number; labels: readonly string[] }) => {
  const total = labels.length;
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between gap-3 text-sm mb-2">
        <span className="font-heading text-xs uppercase tracking-wider text-primary font-bold">
          Étape {step} sur {total}
        </span>
        <span className="text-muted-foreground font-medium">{labels[step - 1]}</span>
      </div>
      <div
        className="h-2 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={`Étape ${step} sur ${total} : ${labels[step - 1]}`}
      >
        <div
          className="h-full rounded-full bg-gradient-neon transition-[width] duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
