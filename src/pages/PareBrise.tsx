import { Link } from "react-router-dom";
import { Phone, Check, ShieldCheck, Sparkles, MapPin, Home, Building2, ChevronDown, Scale } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import InsurerMarquee from "@/components/InsurerMarquee";
import GiftIllustration from "@/components/GiftIllustration";
import useSeo from "@/hooks/useSeo";
import { legalInfo } from "@/data/legal";
import { assurancesIntro } from "@/data/assurances";
import {
  pareBriseSeo,
  pareBriseRayonKm,
  pareBriseHero,
  pareBriseOffre,
  pareBriseCadeaux,
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

// Données structurées : le service (avec le garage et sa zone) + la FAQ.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: pareBriseSeo.serviceName,
      serviceType: "Remplacement de pare-brise",
      description: pareBriseSeo.description,
      provider: {
        "@type": "AutoRepair",
        name: "B MATIC",
        legalName: legalInfo.companyName,
        telephone: legalInfo.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: legalInfo.addressParts.street,
          postalCode: legalInfo.addressParts.postalCode,
          addressLocality: legalInfo.addressParts.city,
          addressRegion: legalInfo.addressParts.region,
          addressCountry: legalInfo.addressParts.country,
        },
      },
      areaServed: [
        ...pareBriseLieu.villes.map((name) => ({ "@type": "City", name })),
        {
          "@type": "GeoCircle",
          geoMidpoint: { "@type": "GeoCoordinates", latitude: 50.6326, longitude: 5.5797 }, // Liège
          geoRadius: pareBriseRayonKm * 1000,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: pareBriseFaq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.reponse },
      })),
    },
  ],
};

/** Titre de section commun. */
const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="max-w-2xl mx-auto text-center mb-8">
    <h2 className="font-heading text-2xl md:text-3xl font-bold leading-tight">
      <span className="text-gradient-neon">{children}</span>
    </h2>
    {sub && <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed">{sub}</p>}
  </div>
);

/** Liste de puces cochées (liberté de choix, qualité). */
const Puces = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap justify-center gap-2 mt-6">
    {items.map((p) => (
      <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3.5 py-2 text-sm">
        <Check className="w-4 h-4 text-neon-cyan shrink-0" aria-hidden="true" />
        {p}
      </li>
    ))}
  </ul>
);

/** Les deux boutons d'action (réservation + téléphone). */
const Ctas = ({ label, to }: { label: string; to: string }) => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center">
    <Link to={to} className="btn-main btn-sparkle min-h-[48px]">
      <Sparkles className="w-4 h-4" aria-hidden="true" /> {label}
    </Link>
    <a href={legalInfo.phoneHref} className="btn-ghost min-h-[48px]">
      <Phone className="w-4 h-4" aria-hidden="true" /> {legalInfo.phone}
    </a>
  </div>
);

const PareBrise = () => {
  useSeo({ title: pareBriseSeo.title, description: pareBriseSeo.description, jsonLd });

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* ----------------------------------------------------------- Hero */}
        <AnimatedSection>
          <section className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block text-neon-cyan text-xs font-heading uppercase tracking-widest mb-4">
              {pareBriseHero.surtitre}
            </span>
            <h1 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mb-5">
              {pareBriseHero.titre}{" "}
              <span className="text-gradient-neon">{pareBriseHero.titreAccent}</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">{pareBriseHero.sousTitre}</p>
            <Ctas {...pareBriseHero.ctaPrincipal} />
            <ul className="flex flex-wrap justify-center gap-2 mt-8" aria-label="Points clés de l'offre">
              {pareBriseHero.badges.map((b) => (
                <li key={b} className="rounded-full border border-neon-purple/40 bg-primary/10 px-3 py-1.5 text-xs font-medium">
                  {b}
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        {/* ------------------------------------------------- Offre & cadeaux */}
        <AnimatedSection>
          <section className="mb-16">
            <SectionTitle sub={pareBriseOffre.texte}>{pareBriseOffre.titre}</SectionTitle>
            <p className="text-center text-sm font-semibold mb-4">{pareBriseOffre.note}</p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              {pareBriseCadeaux.map((c) => (
                <li
                  key={c.nom}
                  className="gift-tile rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2"
                >
                  <GiftIllustration name={c.illustration} className="w-16 h-16 md:w-20 md:h-20" />
                  <span className="font-semibold text-sm leading-snug">{c.nom}</span>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        {/* ---------------------------------------------------- Compris */}
        <AnimatedSection>
          <section className="mb-16">
            <SectionTitle>{pareBriseCompris.titre}</SectionTitle>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {pareBriseCompris.points.map((p) => (
                <li key={p.titre} className="flex gap-3 items-start bg-gradient-card border-glow rounded-xl p-4">
                  <span className="shrink-0 w-9 h-9 rounded-lg bg-primary/15 text-neon-cyan grid place-items-center">
                    <Check className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{p.titre}</div>
                    <p className="text-muted-foreground text-sm">{p.texte}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        {/* ---------------------------------------------------- Étapes */}
        <AnimatedSection>
          <section className="mb-16">
            <SectionTitle>{pareBriseEtapes.titre}</SectionTitle>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {pareBriseEtapes.etapes.map((e, i) => (
                <li key={e.titre}>
                  <GlowCard className="h-full">
                    <span className="font-heading text-3xl font-bold text-gradient-neon" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold mt-2 mb-1">{e.titre}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{e.texte}</p>
                  </GlowCard>
                </li>
              ))}
            </ol>
          </section>
        </AnimatedSection>

        {/* ------------------------------------------ Au centre ou chez vous */}
        <AnimatedSection>
          <section className="mb-16">
            <SectionTitle>{pareBriseLieu.titre}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                { ...pareBriseLieu.centre, Icon: Building2 },
                { ...pareBriseLieu.domicile, Icon: Home },
              ].map(({ titre, texte, Icon }) => (
                <GlowCard key={titre} className="h-full">
                  <Icon className="w-7 h-7 text-neon-pink mb-3" aria-hidden="true" />
                  <h3 className="font-semibold mb-1">{titre}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{texte}</p>
                </GlowCard>
              ))}
            </div>
            <div className="max-w-4xl mx-auto mt-6 text-center">
              <h3 className="inline-flex items-center gap-1.5 font-heading text-sm uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4 text-neon-cyan" aria-hidden="true" /> {pareBriseLieu.zoneTitre}
              </h3>
              <ul className="flex flex-wrap justify-center gap-2">
                {pareBriseLieu.villes.map((v) => (
                  <li key={v} className="rounded-full bg-input border border-border px-3 py-1.5 text-sm">
                    {v}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground text-sm mt-3">{pareBriseLieu.zoneNote}</p>
            </div>
          </section>
        </AnimatedSection>

        {/* ----------------------------------------------- Liberté de choix */}
        <AnimatedSection>
          <GlowCard className="max-w-3xl mx-auto mb-16 text-center md:p-10">
            <Scale className="w-8 h-8 text-neon-cyan mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-heading text-xl md:text-2xl font-bold leading-snug mb-3">{pareBriseLiberte.titre}</h2>
            <p className="text-muted-foreground">{pareBriseLiberte.texte}</p>
            <Puces items={pareBriseLiberte.puces} />
          </GlowCard>
        </AnimatedSection>

        {/* ----------------------------------------------------- Qualité 43R */}
        <AnimatedSection>
          <section className="max-w-3xl mx-auto mb-16 text-center">
            <SectionTitle>{pareBriseQualite.titre}</SectionTitle>
            {pareBriseQualite.paragraphes.map((p) => (
              <p key={p} className="text-muted-foreground leading-relaxed mb-3">
                {p}
              </p>
            ))}
            <Puces items={pareBriseQualite.puces} />
          </section>
        </AnimatedSection>

        {/* ------------------------------------------------------ Assurances */}
        <AnimatedSection>
          <GlowCard className="max-w-4xl mx-auto mb-16 md:p-10">
            <ShieldCheck className="w-8 h-8 text-neon-cyan mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-heading text-xl md:text-2xl font-bold text-center leading-snug mb-5">
              {pareBriseAssurances.titre}
            </h2>
            <ul className="space-y-2.5 max-w-xl mx-auto mb-8">
              {pareBriseAssurances.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed">
                  <Check className="w-4 h-4 mt-0.5 text-neon-cyan shrink-0" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-center font-semibold mb-4">{assurancesIntro}</p>
            <InsurerMarquee />
            <p className="text-muted-foreground text-xs text-center mt-5">{pareBriseAssurances.suite}</p>
          </GlowCard>
        </AnimatedSection>

        {/* ----------------------------------------------------------- FAQ */}
        <AnimatedSection>
          <section className="max-w-3xl mx-auto mb-16">
            <SectionTitle>Questions fréquentes</SectionTitle>
            <div className="space-y-2.5">
              {pareBriseFaq.map((q) => (
                <details key={q.question} className="group rounded-xl border border-border bg-gradient-card">
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none min-h-[52px] px-4 py-3 font-semibold text-sm [&::-webkit-details-marker]:hidden">
                    {q.question}
                    <ChevronDown className="w-4 h-4 shrink-0 text-neon-cyan transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">{q.reponse}</p>
                </details>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* --------------------------------------------------------- CTA final */}
        <AnimatedSection>
          <section className="max-w-2xl mx-auto text-center mb-12">
            <Sparkles className="w-8 h-8 text-neon-pink mx-auto mb-4" aria-hidden="true" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">{pareBriseCtaFinal.titre}</h2>
            <p className="text-muted-foreground mb-7">{pareBriseCtaFinal.texte}</p>
            <Ctas {...pareBriseCtaFinal.cta} />
          </section>
        </AnimatedSection>

        {/* --------------------------------------------- Mention légale offre */}
        <div className="max-w-3xl mx-auto border-t border-border pt-6">
          <p className="text-muted-foreground text-[11px] leading-relaxed">* {pareBriseMention}</p>
        </div>
      </div>
    </div>
  );
};

export default PareBrise;
