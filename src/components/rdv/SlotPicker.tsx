import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { rdvHeures, rdvRegles, rdvTextes } from "@/data/rdv";
import { rdvCreneau } from "@/data/rendezvous";
import { addDays, brusselsNow, fetchTakenSlots, isSlotInWindow, slotKey } from "@/lib/rdv";
import { heureLabel, longDate } from "@/lib/rendezvous";

// ============================================================================
//  SlotPicker — calendrier 7j/7 + créneaux d'1 h (étape « Créneau »)
// ----------------------------------------------------------------------------
//  Les créneaux déjà réservés (table Supabase, RPC rdv_taken_slots) sont
//  MASQUÉS. Agenda injoignable → tous les créneaux sont proposés et la page
//  envoie la demande « créneau à confirmer ».
// ============================================================================

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const pad = (n: number) => (n < 10 ? "0" : "") + n;
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

const SlotPicker = ({
  date,
  hour,
  onChange,
  refreshKey,
}: {
  date: string;
  hour: number | null;
  onChange: (date: string, hour: number | null) => void;
  /** Incrémenté après un « créneau déjà pris » pour recharger l'agenda. */
  refreshKey: number;
}) => {
  const today = brusselsNow().date;
  const [month, setMonth] = useState(() => {
    const [y, m] = (date || today).split("-").map(Number);
    return { y, m: m - 1 };
  });
  const [taken, setTaken] = useState<Set<string> | null>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const from = ymd(month.y, month.m, 1);
    const to = ymd(month.y, month.m, new Date(month.y, month.m + 1, 0).getDate());
    setLoading(true);
    fetchTakenSlots(from, to).then((set) => {
      if (cancelled) return;
      setTaken(set);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [month, refreshKey]);

  const freeHours = (day: string) => rdvHeures.filter((h) => isSlotInWindow(day, h) && !taken?.has(slotKey(day, h)));

  const days = useMemo(() => {
    const lead = (new Date(month.y, month.m, 1).getDay() + 6) % 7; // lundi = 0
    const total = new Date(month.y, month.m + 1, 0).getDate();
    const cells: ({ key: string; day: number; free: boolean } | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= total; d++) {
      const key = ymd(month.y, month.m, d);
      cells.push({ key, day: d, free: freeHours(key).length > 0 });
    }
    return cells;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, taken]);

  const canPrev = ymd(month.y, month.m, 1) > `${today.slice(0, 7)}-01`;
  const next = new Date(month.y, month.m + 1, 1);
  const canNext = ymd(next.getFullYear(), next.getMonth(), 1) <= addDays(today, rdvRegles.horizonJours);
  const shift = (n: number) => {
    const d = new Date(month.y, month.m + n, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  };

  const hours = date ? freeHours(date) : [];
  const navBtn =
    "w-11 h-11 rounded-lg border border-border grid place-items-center text-muted-foreground enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-30 transition-colors";

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-start">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold capitalize">
            {MONTHS[month.m]} {month.y}
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={!canPrev} onClick={() => shift(-1)} aria-label="Mois précédent" className={navBtn}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" disabled={!canNext} onClick={() => shift(1)} aria-label="Mois suivant" className={navBtn}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-1.5" aria-hidden="true">
          {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
            <span key={d} className="text-center text-[11px] font-semibold text-muted-foreground uppercase py-1">
              {d}
            </span>
          ))}
        </div>
        <div className={`grid grid-cols-7 gap-1.5 transition-opacity ${loading ? "opacity-50" : ""}`} aria-busy={loading}>
          {days.map((c, i) =>
            c === null ? (
              <div key={`e${i}`} />
            ) : (
              <button
                key={c.key}
                type="button"
                disabled={!c.free || loading}
                onClick={() => onChange(c.key, null)}
                aria-label={c.free ? longDate(c.key) : `${longDate(c.key)}, complet ou passé`}
                aria-pressed={c.key === date}
                className={`h-11 rounded-lg text-sm font-medium grid place-items-center transition-all ${
                  c.key === date
                    ? "bg-gradient-neon text-primary-foreground font-bold shadow-md"
                    : c.free
                      ? "bg-card border border-border hover:border-primary hover:text-primary"
                      : "text-muted-foreground/40"
                }`}
              >
                {c.day}
              </button>
            ),
          )}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-3">{date ? `Le ${longDate(date)}` : "Heure"}</div>
        {taken === null && (
          <p className="flex gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3 mb-3">
            <Info className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" /> {rdvTextes.agendaIndisponible}
          </p>
        )}
        {!date ? (
          <p className="text-muted-foreground text-sm py-6 text-center border border-dashed border-border rounded-xl">{rdvCreneau.choisirDate}</p>
        ) : hours.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center border border-dashed border-border rounded-xl">{rdvCreneau.aucunCreneau}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label={`Heures libres le ${longDate(date)}`}>
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={h === hour}
                onClick={() => onChange(date, h)}
                className={`h-12 rounded-xl border-2 text-[15px] font-semibold transition-all ${
                  h === hour ? "bg-gradient-neon border-transparent text-primary-foreground shadow-md" : "bg-card border-border hover:border-primary"
                }`}
              >
                {heureLabel(h)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPicker;
