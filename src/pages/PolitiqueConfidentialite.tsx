import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { legalInfo, supervisoryAuthority } from "@/data/legal";
import useSeo from "@/hooks/useSeo";
import { pagesSeo } from "@/data/seo";

const PolitiqueConfidentialite = () => {
  useSeo({ ...pagesSeo["/politique-de-confidentialite"] });
  return (
    <LegalPage title="Politique de confidentialité" updated={legalInfo.lastUpdated}>
      <p>
        La présente politique de confidentialité décrit la manière dont{" "}
        <strong>{legalInfo.companyName}</strong> (« nous ») collecte, utilise et protège les
        données à caractère personnel des utilisateurs du site, conformément au Règlement
        général sur la protection des données (RGPD — Règlement UE 2016/679) et à la
        législation nationale applicable.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est :
      </p>
      <ul>
        <li><strong>{legalInfo.companyName}</strong>{legalInfo.legalForm && ` — ${legalInfo.legalForm}`}</li>
        <li>Siège social : {legalInfo.registeredOffice}</li>
        <li>Atelier et contact : {legalInfo.address}</li>
        <li>Numéro d'entreprise (BCE) : {legalInfo.registration}</li>
        <li>E-mail : <a href={`mailto:${legalInfo.email}`}>{legalInfo.email}</a></li>
        <li>Téléphone : <a href={legalInfo.phoneHref}>{legalInfo.phone}</a></li>
      </ul>
      <p>
        Pour toute question relative à vos données, vous pouvez nous écrire à{" "}
        <a href={`mailto:${legalInfo.dpoEmail}`}>{legalInfo.dpoEmail}</a>.
      </p>

      <h2>2. Données que nous collectons</h2>
      <p>Nous collectons uniquement les données que vous nous transmettez volontairement via nos formulaires :</p>
      <ul>
        <li><strong>Formulaire de contact :</strong> nom, adresse e-mail, numéro de téléphone et contenu de votre message.</li>
        <li>
          <strong>Demande de devis / de rappel pour un rendez-vous pare-brise :</strong> prénom,
          nom, téléphone, e-mail (facultatif : sert uniquement à vous envoyer la confirmation de
          votre demande), moment de rappel souhaité (dès que possible, ou un
          jour et une demi-journée), vitrage(s) concerné(s), couverture bris de glace
          (oui / non / je ne sais pas) et véhicule (plaque d'immatriculation, ou marque, modèle
          et éventuellement année).
        </li>
      </ul>
      <p>
        Les demandes envoyées via ces formulaires nous parviennent par e-mail et sont
        également enregistrées dans notre espace de gestion sécurisé, accessible aux seules
        personnes habilitées.
      </p>
      <p>
        <strong>Statistiques de fréquentation :</strong> nous comptons les pages consultées
        (adresse de la page, sans paramètres), la date et, à l'arrivée sur le site, le seul nom
        du site d'origine (par exemple « google.com »). Nous comptons aussi les clics sur nos
        boutons de contact (WhatsApp, téléphone, e-mail, prise de rendez-vous) : seuls le type
        de bouton, la page et la date sont notés. Ces statistiques sont mesurées{" "}
        <strong>sans cookie</strong>, sans identifiant et sans aucun stockage sur votre
        appareil ; nous n'enregistrons pas votre adresse IP (comme pour toute connexion à un
        site, elle est techniquement transmise à nos hébergeurs pour acheminer la requête,
        mais elle n'est pas associée à ces statistiques). Elles ne permettent pas de vous
        identifier.
      </p>
      <p>
        Nous ne collectons aucune donnée dite « sensible » et ne pratiquons aucun profilage
        ni décision automatisée. Les champs obligatoires sont signalés par un astérisque (*).
      </p>

      <h2>3. Finalités et bases légales</h2>
      <table>
        <thead>
          <tr><th>Finalité</th><th>Base légale (RGPD)</th><th>Durée de conservation</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Répondre à une demande de contact</td>
            <td>Votre consentement (art. 6.1.a) et notre intérêt légitime à répondre</td>
            <td>{legalInfo.leadsRetentionYears} ans à compter de la demande</td>
          </tr>
          <tr>
            <td>Vous rappeler et gérer une prise de rendez-vous</td>
            <td>Mesures précontractuelles / exécution du service (art. 6.1.b)</td>
            <td>
              Demande : {legalInfo.leadsRetentionYears} ans à compter de la demande. Factures
              éventuelles : durée imposée par les obligations comptables (jusqu'à 10 ans)
            </td>
          </tr>
          <tr>
            <td>Mesurer la fréquentation du site</td>
            <td>Notre intérêt légitime à améliorer le site (art. 6.1.f) — données non identifiantes</td>
            <td>Données anonymes, conservées à des fins statistiques</td>
          </tr>
        </tbody>
      </table>
      <p>
        Passé le délai de {legalInfo.leadsRetentionYears} ans, les demandes enregistrées dans
        notre espace de gestion sont supprimées automatiquement.
      </p>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>
        Vos données sont destinées exclusivement à {legalInfo.companyName} et à son personnel
        habilité. Elles ne sont jamais vendues ni cédées à des tiers à des fins commerciales.
      </p>
      <p>Pour faire fonctionner le site, nous faisons appel aux sous-traitants suivants :</p>
      <ul>
        <li>
          <strong>Formspree</strong> (Formspree, Inc.) — acheminement des formulaires par e-mail.
          Ce prestataire est établi aux États-Unis : vos données peuvent donc être transférées
          hors de l'Union européenne, dans le cadre de garanties appropriées (clauses
          contractuelles types de la Commission européenne). Voir leur politique :{" "}
          <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">formspree.io</a>.
        </li>
        <li>
          <strong>{legalInfo.database.name}</strong> ({legalInfo.database.company}) — hébergement
          de la base de données et des fichiers (demandes reçues, statistiques de fréquentation,
          contenus du site).
          Serveurs situés : {legalInfo.database.region}. Ce prestataire est établi aux États-Unis ;
          tout transfert éventuel hors de l'Union européenne est encadré par des garanties
          appropriées (clauses contractuelles types). Voir leur politique :{" "}
          <a href={legalInfo.database.privacyUrl} target="_blank" rel="noopener noreferrer">supabase.com</a>.
        </li>
        <li>
          <strong>{legalInfo.emailService.name}</strong> ({legalInfo.emailService.company}) — envoi
          de l'e-mail de confirmation de votre demande de rappel, uniquement si vous avez indiqué
          votre adresse e-mail. Seuls votre adresse, votre prénom, votre numéro de téléphone et le
          résumé de votre demande (moment du rappel, vitrage, couverture bris de glace) lui sont
          transmis. Prestataire établi dans l'Union européenne. Voir leur politique :{" "}
          <a href={legalInfo.emailService.privacyUrl} target="_blank" rel="noopener noreferrer">brevo.com</a>.
        </li>
        <li>
          <strong>{legalInfo.host.name}</strong> — hébergement du site.
        </li>
        <li>
          <strong>Google Maps</strong> (Google Ireland Ltd.) — carte du centre affichée sur les
          pages Accueil et Contact. Lorsque la carte s'affiche, Google reçoit votre adresse IP et
          des informations techniques sur votre navigateur, et{" "}
          <strong>peut déposer ses propres cookies</strong>, sous sa responsabilité. Le bouton
          « Itinéraire » ouvre Google Maps dans un nouvel onglet. Voir leur politique :{" "}
          <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">policies.google.com</a>.
        </li>
        <li>
          <strong>{legalInfo.aiAssistant.name}</strong> ({legalInfo.aiAssistant.company}) — assistant
          d'intelligence artificielle utilisé uniquement pour l'aide à la rédaction des
          actualités, dans l'espace d'administration (seuls les textes du centre lui sont
          transmis). Vos coordonnées et les données des formulaires{" "}
          <strong>ne lui sont jamais envoyées</strong>. Ce prestataire est établi aux États-Unis
          (transferts encadrés par des garanties appropriées). Voir leurs conditions :{" "}
          <a href={legalInfo.aiAssistant.termsUrl} target="_blank" rel="noopener noreferrer">ai.google.dev</a>.
        </li>
      </ul>

      <h2>5. Cookies et stockage local</h2>
      <p>
        Ce site n'utilise <strong>aucun cookie publicitaire ni de suivi (tracking)</strong>, y
        compris pour la mesure de fréquentation décrite plus haut.
        Nous utilisons uniquement un stockage strictement nécessaire au fonctionnement du site,
        par exemple pour mémoriser votre choix concernant le présent bandeau d'information.
        Ce stockage ne nécessite pas de consentement. Les polices d'écriture sont hébergées
        localement sur le site : leur affichage n'entraîne aucun appel vers un serveur tiers.
      </p>
      <p>
        <strong>Carte Google Maps :</strong> la carte du centre (pages Accueil et Contact) est
        fournie par Google, qui peut déposer ses propres cookies lors de son affichage (voir § 4).
      </p>

      <h2>6. Sécurité</h2>
      <p>
        Les formulaires sont transmis via une connexion chiffrée (HTTPS). L'accès aux demandes
        enregistrées est réservé aux administrateurs authentifiés et protégé par des règles
        d'accès au niveau de la base de données. Nous mettons en œuvre
        des mesures techniques et organisationnelles raisonnables pour protéger vos données
        contre tout accès, perte ou divulgation non autorisés.
      </p>

      <h2>7. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez à tout moment des droits suivants :</p>
      <ul>
        <li>Droit d'<strong>accès</strong> à vos données ;</li>
        <li>Droit de <strong>rectification</strong> des données inexactes ;</li>
        <li>Droit à l'<strong>effacement</strong> (« droit à l'oubli ») ;</li>
        <li>Droit à la <strong>limitation</strong> du traitement ;</li>
        <li>Droit à la <strong>portabilité</strong> de vos données ;</li>
        <li>Droit d'<strong>opposition</strong> au traitement ;</li>
        <li>Droit de <strong>retirer votre consentement</strong> à tout moment.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez-nous à{" "}
        <a href={`mailto:${legalInfo.dpoEmail}`}>{legalInfo.dpoEmail}</a>. Nous répondons dans un
        délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        introduire une réclamation auprès de {supervisoryAuthority.name} :{" "}
        <a href={supervisoryAuthority.website} target="_blank" rel="noopener noreferrer">
          {supervisoryAuthority.website.replace("https://", "")}
        </a>.
      </p>

      <h2>8. Modifications</h2>
      <p>
        Nous pouvons mettre à jour cette politique à tout moment. La date de dernière mise à
        jour figure en haut de cette page. Voir aussi nos{" "}
        <Link to="/mentions-legales">mentions légales</Link>.
      </p>
    </LegalPage>
  );
};

export default PolitiqueConfidentialite;
