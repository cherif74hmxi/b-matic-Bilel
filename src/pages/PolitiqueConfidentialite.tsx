import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { legalInfo, supervisoryAuthority } from "@/data/legal";

const PolitiqueConfidentialite = () => {
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
        <li>Adresse : {legalInfo.address}</li>
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
        <li><strong>Prise de rendez-vous (mécanique / detailing) :</strong> prénom, nom, e-mail, téléphone, prestation choisie, date et heure souhaitées, et informations sur votre véhicule (numéro de châssis / VIN ou photo de la carte grise).</li>
        <li><strong>Demande de reprise de véhicule :</strong> prénom, nom, e-mail, téléphone, caractéristiques et état du véhicule, ainsi que les photos et documents que vous choisissez de joindre (véhicule, carnet d'entretien, factures).</li>
      </ul>
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
            <td>Jusqu'à 3 ans après le dernier échange</td>
          </tr>
          <tr>
            <td>Gérer une prise de rendez-vous</td>
            <td>Mesures précontractuelles / exécution du service (art. 6.1.b)</td>
            <td>Durée de la relation, puis obligations comptables (jusqu'à 10 ans)</td>
          </tr>
          <tr>
            <td>Établir une offre de reprise de véhicule</td>
            <td>Mesures précontractuelles à votre demande (art. 6.1.b) et consentement</td>
            <td>Jusqu'à 1 an en l'absence de suite donnée</td>
          </tr>
        </tbody>
      </table>

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
          <strong>Google Fonts</strong> (Google) — chargement des polices d'écriture, ce qui
          peut impliquer la communication de votre adresse IP à Google.
        </li>
        <li>
          <strong>{legalInfo.host.name}</strong> — hébergement du site.
        </li>
      </ul>

      <h2>5. Cookies et stockage local</h2>
      <p>
        Ce site n'utilise <strong>aucun cookie publicitaire ni de suivi (tracking)</strong>.
        Nous utilisons uniquement un stockage strictement nécessaire au fonctionnement du site,
        par exemple pour mémoriser votre choix concernant le présent bandeau d'information.
        Ce stockage ne nécessite pas de consentement. Les polices Google Fonts sont chargées
        depuis les serveurs de Google (voir section 4).
      </p>

      <h2>6. Sécurité</h2>
      <p>
        Les formulaires sont transmis via une connexion chiffrée (HTTPS). Nous mettons en œuvre
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
