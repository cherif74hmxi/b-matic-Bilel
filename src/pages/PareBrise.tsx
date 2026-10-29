import { Link } from "react-router-dom";
import { Phone, Check, MapPin, Home, Building2, ChevronDown, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GiftGrid from "@/components/GiftGrid";
import InsurerLogos from "@/components/InsurerLogos";
import useSeo from "@/hooks/useSeo";
import { accentuer } from "@/lib/accent";
import { pareBriseJsonLd } from "@/seo/schema";
import { legalInfo } from "@/data/legal";
import { assurancesIntro } from "@/data/assurances";
import {
  pareBriseSeo,
  pareBriseHero,
  pareBriseOffre,
  pareBriseCompris,
  pareBriseEtapes,
  pareBriseLieu,
  pareBriseLiberte,
  pareBriseQualite,
  pareBriseAssurances,
  pareBriseFaq,
  pareBriseCtaFinal,
  pareBriseMention,
} from "@/data/parebrise";

// Couleurs : violet du logo (--primary) pour les actions, icônes et mots
// accentués des titres ; cyan du logo (--highlight) pour les coches.

/** Titre de section commun ; les [crochets] du texte passent en violet. */
const SectionTitle = ({ titre, sub }: { titre: string; sub?: string }) => (
  <div className="max-w-2xl mx-auto text-center mb-10">
    <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight text-balance">{accentuer(titre)}</h2>
    {sub && <p className="text-muted-foreground text-[15px] md:text-base mt-4 leading-relaxed">{sub}</p>}
  </div>
);

/** Liste de puces cochées (liberté de choix, qualité). */
const Puces = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
    {items.map((p) => (
      <li key={p} className="inline-flex items-center gap-2 text-[15px]">
        <Check className="w-4 h-4 text-highlight shrink-0" strokeWidth={2.5} aria-hidden="true" />
        {p}
      </li>
    ))}
  </ul>
);

/** Les deux boutons d'action (réservation + téléphone). */
const Ctas = ({ label, to }: { label: string; to: string }) => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center">
    <Link to={to} className="btn-main min-h-[52px]">
      {label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
    <a href={legalInfo.phoneHref} className="btn-ghost min-h-[52px]">
      <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
    </a>
  </div>
);

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <AnimatedSection>
    <section className={`py-14 md:py-20 border-t border-border ${className}`}>{children}</section>
  </AnimatedSection>
);

const PareBrise = () => {
  useSeo({ title: pareBriseSeo.title, description: pareBriseSeo.description, jsonLd: pareBriseJsonLd() });

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* ----------------------------------------------------------- Hero */}
        <AnimatedSection>
          <section className="max-w-3xl mx-auto text-center pt-8 pb-14 md:pb-20">
            <p className="pill-highlight mb-5">{pareBriseHero.surtitre}</p>
            <h1 className="font-heading text-[1.75rem] leading-tight sm:text-4xl md:text-5xl font-bold mb-6">
              {pareBriseHero.titre} <span className="text-primary">{pareBriseHero.titreAccent}</span>{" "}
              {pareBriseHero.titreSuite}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">{pareBriseHero.sousTitre}</p>
            <Ctas {...pareBriseHero.ctaPrincipal} />
            <ul className="flex flex-wrap justify-center gap-2 mt-8" aria-label="Points clés de l'offre">
              {pareBriseHero.badges.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary font-medium px-3.5 py-1.5 text-sm">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" /> {b}
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        {/* ------------------------------------------------- Offre & cadeaux */}
        <Section>
          <SectionTitle titre={pareBriseOffre.titre} sub={pareBriseOffre.texte} />
          <div className="max-w-5xl mx-auto">
            <GiftGrid />
          </div>
        </Section>

        {/* ---------------------------------------------------- Compris */}
        <Section>
          <SectionTitle titre={pareBriseCompris.titre} />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-5xl mx-auto">
            {pareBriseCompris.points.map((p) => (
              <li key={p.titre} className="flex gap-3 items-start">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-highlight" strokeWidth={2.5} aria-hidden="true" />
                <div>
                  <div className="font-semibold">{p.titre}</div>
                  <p className="text-muted-foreground text-[15px] leading-relaxed">{p.texte}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ---------------------------------------------------- Étapes */}
        <Section>
          <SectionTitle titre={pareBriseEtapes.titre} />
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pareBriseEtapes.etapes.map((e, i) => (
              <li key={e.titre} className="border-t-2 border-primary pt-5">
                <span className="font-heading text-sm font-bold text-primary" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="font-semibold text-lg mt-2 mb-1.5">{e.titre}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{e.texte}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ------------------------------------------ Au centre ou chez vous */}
        <Section>
          <SectionTitle titre={pareBriseLieu.titre} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              { ...pareBriseLieu.centre, Icon: Building2 },
              { ...pareBriseLieu.domicile, Icon: Home },
            ].map(({ titre, texte, Icon }) => (
              <div key={titre} className="h-full rounded-xl border border-border p-6">
                <span className="w-12 h-12 rounded-xl bg-primary-soft text-primary grid place-items-center mb-4">
                  <Icon className="w-6 h-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="font-semibold mb-1.5">{titre}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{texte}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto mt-10 text-center">
            <h3 className="inline-flex items-center gap-1.5 eyebrow mb-4">
              <MapPin className="w-4 h-4" aria-hidden="true" /> {pareBriseLieu.zoneTitre}
            </h3>
            <ul className="flex flex-wrap justify-center gap-2">
              {pareBriseLieu.villes.map((v) => (
                <li key={v} className="rounded-full bg-muted px-3.5 py-1.5 text-sm">
                  {v}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-sm mt-4">{pareBriseLieu.zoneNote}</p>
          </div>
        </Section>

        {/* ----------------------------------------------- Liberté de choix */}
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-4">{accentuer(pareBriseLiberte.titre)}</h2>
            <p className="text-muted-foreground leading-relaxed">{pareBriseLiberte.texte}</p>
            <Puces items={pareBriseLiberte.puces} />
          </div>
        </Section>

        {/* ----------------------------------------------------- Qualité 43R */}
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <SectionTitle titre={pareBriseQualite.titre} />
            {pareBriseQualite.paragraphes.map((p) => (
              <p key={p} className="text-muted-foreground leading-relaxed mb-3">
                {p}
              </p>
            ))}
            <Puces items={pareBriseQualite.puces} />
          </div>
        </Section>

        {/* ------------------------------------------------------ Assurances */}
        <Section>
          <div className="max-w-5xl mx-auto rounded-2xl bg-primary-soft px-4 py-10 sm:px-8 md:py-14">
            <SectionTitle titre={pareBriseAssurances.titre} />
            <ul className="space-y-3 max-w-2xl mx-auto mb-10">
              {pareBriseAssurances.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed">
                  <Check className="w-4 h-4 mt-1 text-highlight shrink-0" strokeWidth={2.5} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-center font-semibold mb-5">{assurancesIntro}</p>
            <div className="max-w-4xl mx-auto">
              <InsurerLogos />
            </div>
            <p className="text-muted-foreground text-sm text-center mt-6">{pareBriseAssurances.suite}</p>
          </div>
        </Section>

        {/* ----------------------------------------------------------- FAQ */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <SectionTitle titre="Questions fréquentes" />
            <div className="border-t border-border">
              {pareBriseFaq.map((q) => (
                <details key={q.question} className="group border-b border-border">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none min-h-[56px] py-4 font-semibold text-[15px] transition-colors hover:text-primary group-open:text-primary [&::-webkit-details-marker]:hidden">
                    {q.question}
                    <ChevronDown className="w-5 h-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 -mt-1 text-muted-foreground text-[15px] leading-relaxed">{q.reponse}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* --------------------------------------------------------- CTA final */}
        <AnimatedSection>
          <section className="max-w-5xl mx-auto bg-primary text-primary-foreground rounded-2xl px-4 py-10 sm:px-6 md:px-14 md:py-14 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">{pareBriseCtaFinal.titre}</h2>
            <p className="text-primary-foreground/85 mb-8 max-w-xl mx-auto">{pareBriseCtaFinal.texte}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={pareBriseCtaFinal.cta.to} className="btn-main min-h-[52px] !bg-white !text-primary hover:!bg-white/90 !px-4 sm:!px-6">
                {pareBriseCtaFinal.cta.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href={legalInfo.phoneHref} className="btn-ghost min-h-[52px] !bg-transparent !text-white !border-white/50 hover:!bg-white/10">
                <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
              </a>
            </div>
          </section>
        </AnimatedSection>

        {/* --------------------------------------------- Mention légale offre */}
        <p className="max-w-5xl mx-auto text-xs leading-relaxed text-muted-foreground mt-5">* {pareBriseMention}</p>
      </div>
    </div>
  );
};

export default PareBrise;
