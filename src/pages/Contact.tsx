import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import { legalInfo } from "@/data/legal";
import { sendLead } from "@/lib/leads";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";
import { contactJsonLd } from "@/seo/schema";

const Contact = () => {
  useSeo({ ...pagesSeo["/contact"], jsonLd: contactJsonLd() });
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<{ status: string; message: string }>({ status: "idle", message: "" });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = form.nom.trim() && emailValid && form.message.trim() && consent;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setFormState({ status: "loading", message: "Envoi en cours..." });
    try {
      // Double envoi : e-mail (Formspree) + espace admin (Supabase).
      const ok = await sendLead(
        () =>
          fetch("https://formspree.io/f/mlgokojb", {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }),
        { type: "contact", name: form.nom, email: form.email, phone: form.telephone, message: form.message },
      );
      if (!ok) throw new Error("server");
      setForm({ nom: "", email: "", telephone: "", message: "" });
      setConsent(false);
      setFormState({ status: "success", message: "Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement." });
      setTimeout(() => setFormState({ status: "idle", message: "" }), 6000);
    } catch {
      setFormState({ status: "error", message: "Une erreur est survenue. Veuillez réessayer ou nous contacter directement." });
      setTimeout(() => setFormState({ status: "idle", message: "" }), 6000);
    }
  };

  const inputClass = "w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm";

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient-neon">Contactez</span> <span className="text-foreground">-nous</span>
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Une question, un devis ou un besoin urgent ? Notre équipe est disponible pour vous accompagner.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatedSection>
            <GlowCard>
              <h2 className="font-heading text-xl font-semibold mb-6 text-foreground">Nos coordonnées</h2>
              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neon-purple mt-0.5" />
                  <div>
                    <p className="text-foreground text-sm font-medium">Adresse</p>
                    <p className="text-muted-foreground text-sm">{legalInfo.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-neon-purple mt-0.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <div>
                    <p className="text-foreground text-sm font-medium">Numéro WhatsApp</p>
                    <a href={legalInfo.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors">{legalInfo.whatsappDisplay}</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neon-purple mt-0.5" />
                  <div>
                    <p className="text-foreground text-sm font-medium">E-mail</p>
                    <a href={`mailto:${legalInfo.email}`} className="text-muted-foreground text-sm hover:text-foreground transition-colors">{legalInfo.email}</a>
                  </div>
                </li>
              </ul>

              {/* Google Maps placeholder */}
              <div className="w-full h-48 rounded-lg bg-muted border border-border flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Google Maps — à intégrer</p>
              </div>
            </GlowCard>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <GlowCard>
              <h2 className="font-heading text-xl font-semibold mb-6 text-foreground">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet *"
                  aria-label="Nom complet (obligatoire)"
                  autoComplete="name"
                  className={inputClass}
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                />
                <div>
                  <input
                    type="email"
                    placeholder="Adresse e-mail *"
                    aria-label="Adresse e-mail (obligatoire)"
                    autoComplete="email"
                    aria-invalid={Boolean(form.email && !emailValid)}
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  {form.email && !emailValid && <p className="text-destructive text-xs mt-1">Format d'e-mail invalide</p>}
                </div>
                <input
                  type="tel"
                  placeholder="Téléphone"
                  aria-label="Téléphone"
                  autoComplete="tel"
                  className={inputClass}
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                />
                <textarea
                  placeholder="Votre message *"
                  aria-label="Votre message (obligatoire)"
                  rows={5}
                  className={inputClass}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 accent-neon-purple mt-0.5 shrink-0" required />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    J'accepte que mes données soient traitées pour répondre à ma demande, conformément à la <Link to="/politique-de-confidentialite" className="text-neon-cyan underline underline-offset-2 hover:text-neon-blue">politique de confidentialité</Link>.
                  </span>
                </label>
                <NeonButton type="submit" disabled={!valid || formState.status === "loading"} className="w-full">
                  {formState.status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
                </NeonButton>
                {formState.message && (
                  <div className={`mt-2 p-4 rounded-lg text-sm text-center font-medium ${formState.status === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : formState.status === "error" ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-muted text-muted-foreground"}`}>
                    {formState.message}
                  </div>
                )}
              </form>
            </GlowCard>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Contact;
