import { KeyboardEvent, PointerEvent, useRef, useState } from "react";
import { bucketLabel, type Bucket, type TrafficPoint } from "@/lib/kpi";

// ============================================================================
//  TrafficChart — courbe de fréquentation en barres (une seule série)
// ----------------------------------------------------------------------------
//  Survol / toucher / flèches du clavier : la valeur du point sélectionné
//  s'affiche au-dessus du graphique (lisible sur téléphone, rien ne déborde).
//  Le détail chiffré reste accessible en tableau sous le graphique.
// ============================================================================

const nf = new Intl.NumberFormat("fr-BE");

export type TrafficMetric = "visits" | "views";

const METRIC_LABELS: Record<TrafficMetric, { one: string; many: string }> = {
  visits: { one: "visite", many: "visites" },
  views: { one: "page vue", many: "pages vues" },
};

const plural = (n: number, metric: TrafficMetric) =>
  `${nf.format(n)} ${n > 1 ? METRIC_LABELS[metric].many : METRIC_LABELS[metric].one}`;

/** Maximum « rond » de l'axe (1, 2, 5 × 10ⁿ). */
function niceMax(value: number) {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

interface TrafficChartProps {
  points: TrafficPoint[];
  bucket: Bucket;
  metric: TrafficMetric;
}

const TrafficChart = ({ points, bucket, metric }: TrafficChartProps) => {
  const [active, setActive] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const n = points.length;
  const max = niceMax(Math.max(0, ...points.map((p) => p[metric])));
  const total = points.reduce((sum, p) => sum + p[metric], 0);
  const gap = n <= 40 ? 2 : n <= 120 ? 1 : 0;

  const indexAt = (clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return null;
    return Math.min(n - 1, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * n)));
  };

  const onPointer = (e: PointerEvent<HTMLDivElement>) => setActive(indexAt(e.clientX));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setActive((i) => {
      if (i === null) return e.key === "ArrowLeft" ? n - 1 : 0;
      return Math.min(n - 1, Math.max(0, i + (e.key === "ArrowLeft" ? -1 : 1)));
    });
  };

  const current = active !== null ? points[active] : null;
  // Trois repères sur l'axe horizontal : début, milieu, fin.
  const ticks = n > 2 ? [0, Math.floor((n - 1) / 2), n - 1] : points.map((_, i) => i);

  return (
    <div>
      <p className="min-h-[40px] text-sm" aria-live="polite">
        {current ? (
          <>
            <span className="text-muted-foreground">{bucketLabel(current.bucket, bucket, true)} · </span>
            <strong className="tabular-nums">{plural(current.visits, "visits")}</strong>
            <span className="text-muted-foreground"> · {plural(current.views, "views")}</span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Total : <strong className="text-foreground tabular-nums">{plural(total, metric)}</strong>
            <span className="hidden sm:inline"> — survoler ou toucher une barre pour le détail</span>
          </span>
        )}
      </p>

      <div className="flex gap-2">
        {/* Axe vertical (graduations discrètes) */}
        <div className="flex flex-col justify-between h-44 text-[11px] text-muted-foreground tabular-nums text-right w-8 shrink-0" aria-hidden="true">
          <span className="-translate-y-1/2">{nf.format(max)}</span>
          <span>{nf.format(max / 2)}</span>
          <span className="translate-y-1/2">0</span>
        </div>

        <div className="min-w-0 flex-1">
          <div
            ref={plotRef}
            role="img"
            tabIndex={0}
            aria-label={`Graphique en barres, ${METRIC_LABELS[metric].many} ${bucket === "hour" ? "par heure" : bucket === "day" ? "par jour" : "par mois"}. Flèches gauche et droite pour parcourir les valeurs.`}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
            className="relative h-44 border-b border-border touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-sm"
          >
            {/* Lignes de repère */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 border-t border-dashed border-border/60" />
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/60" />

            <div className="absolute inset-0 flex items-end" style={{ gap }}>
              {points.map((p, i) => (
                <div
                  key={p.bucket}
                  className={`flex-1 min-w-0 rounded-t-[3px] transition-colors ${
                    active === i ? "bg-neon-cyan" : active === null ? "bg-neon-purple" : "bg-neon-purple/50"
                  }`}
                  style={{ height: `${(p[metric] / max) * 100}%`, minHeight: p[metric] > 0 ? 2 : 0 }}
                />
              ))}
            </div>
          </div>

          <div className="relative h-5 mt-1 text-[11px] text-muted-foreground" aria-hidden="true">
            {ticks.map((i, k) => (
              <span
                key={i}
                className={`absolute whitespace-nowrap ${k === 0 ? "left-0" : k === ticks.length - 1 ? "right-0" : "-translate-x-1/2"}`}
                style={k === 0 || k === ticks.length - 1 ? undefined : { left: `${((i + 0.5) / n) * 100}%` }}
              >
                {bucketLabel(points[i].bucket, bucket)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted-foreground min-h-[44px] flex items-center">Voir les chiffres en tableau</summary>
        <div className="max-h-72 overflow-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="text-left font-normal px-4 py-2">Période</th>
                <th scope="col" className="text-right font-normal px-4 py-2">Visites</th>
                <th scope="col" className="text-right font-normal px-4 py-2">Pages vues</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.bucket} className="border-t border-border">
                  <th scope="row" className="text-left font-normal px-4 py-2 first-letter:uppercase">{bucketLabel(p.bucket, bucket, true)}</th>
                  <td className="text-right px-4 py-2 tabular-nums">{nf.format(p.visits)}</td>
                  <td className="text-right px-4 py-2 tabular-nums">{nf.format(p.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default TrafficChart;
