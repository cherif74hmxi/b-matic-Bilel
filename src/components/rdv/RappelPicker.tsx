import { useMemo } from "react";
import { rdvRappel, type PeriodeId } from "@/data/rendezvous";
import { brusselsNow } from "@/lib/rdv";
import { isPeriodeOpen, jourCourt, joursRappel, longDate, plageLabel } from "@/lib/rendezvous";
import ChoiceButton, { ChoiceGroup } from "@/components/rdv/ChoiceButton";

// ============================================================================
//  RappelPicker — jour + plage (matin / après-midi) du rappel souhaité
// ----------------------------------------------------------------------------
//  Pas d'heure précise : le garage rappelle dans la plage choisie pour fixer
//  le rendez-vous. Jours en pastilles qui défilent à l'horizontale sur
//  mobile, sur deux lignes sur ordinateur. Le jour même, les plages trop
//  proches de leur fin sont grisées (lib/rendezvous → isPeriodeOpen).
// ============================================================================

const RappelPicker = ({
  date,
  periode,
  onChange,
}: {
  date: string;
  periode: PeriodeId | "";
  onChange: (date: string, periode: PeriodeId | "") => void;
}) => {
  const { jours, today } = useMemo(() => ({ jours: joursRappel(), today: brusselsNow().date }), []);

  // Changer de jour garde la plage si elle reste possible ce jour-là.
  const pickDay = (d: string) => onChange(d, periode && isPeriodeOpen(d, periode) ? periode : "");

  return (
    // grid-cols-1 = minmax(0, 1fr) : sans lui, la bande des jours élargit la page au lieu de défiler.
    <div className="grid grid-cols-1 gap-5">
      <div>
        <p className="font-semibold mb-2.5">{rdvRappel.jourQuestion}</p>
        <div
          role="radiogroup"
          aria-label={rdvRappel.jourQuestion}
          className="-mx-5 px-5 scroll-px-5 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:flex-wrap md:overflow-visible"
        >
          {jours.map((d) => {
            const j = jourCourt(d, today);
            const selected = d === date;
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={longDate(d)}
                onClick={() => pickDay(d)}
                className={`snap-start shrink-0 w-16 h-[4.75rem] rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected ? "bg-brand border-brand text-brand-foreground" : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <span className={`text-xs font-medium leading-none ${selected ? "" : "text-muted-foreground"}`}>{j.haut}</span>
                <span className="font-heading text-xl font-bold leading-none">{j.jour}</span>
                <span className={`text-xs leading-none ${selected ? "" : "text-muted-foreground"}`}>{j.mois}</span>
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <div className="animate-fade-in">
          <p className="font-semibold mb-2.5">{rdvRappel.periodeQuestion}</p>
          <ChoiceGroup label={rdvRappel.periodeQuestion} className="grid-cols-2">
            {rdvRappel.periodes.map((p) => (
              <ChoiceButton
                key={p.id}
                compact
                selected={periode === p.id}
                disabled={!isPeriodeOpen(date, p.id)}
                onClick={() => onChange(date, p.id)}
                label={p.label}
                texte={plageLabel(p)}
              />
            ))}
          </ChoiceGroup>
        </div>
      )}
    </div>
  );
};

export default RappelPicker;
