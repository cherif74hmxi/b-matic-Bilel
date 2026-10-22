import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { legalInfo } from "@/data/legal";

const MentionsLegales = () => {
  return (
    <LegalPage title="Mentions légales" updated={legalInfo.lastUpdated}>
      <h2>Éditeur du site</h2>
      <p>Le présent site est édité par :</p>
      <ul>
        <li><strong>{legalInfo.companyName}</strong>{legalInfo.legalForm && ` — ${legalInfo.legalForm}`}</li>
        {legalInfo.capital && <li>Capital social : {legalInfo.capital}</li>}
        <li>Siège social : {legalInfo.registeredOffice}</li>
        <li>Atelier et contact : {legalInfo.address}</li>
        <li>Numéro d'entreprise (BCE) : {legalInfo.registration}</li>
        <li>N° de TVA : {legalInfo.vat}</li>
        <li>E-mail : <a href={`mailto:${legalInfo.email}`}>{legalInfo.email}</a></li>
        <li>Téléphone : <a href={legalInfo.phoneHref}>{legalInfo.phone}</a></li>
      </ul>

      <h2>Responsable de la publication</h2>
      <p>{legalInfo.publicationDirector}</p>

      <h2>Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li><strong>{legalInfo.host.name}</strong>{legalInfo.host.company && ` — ${legalInfo.host.company}`}</li>
        <li>Adresse : {legalInfo.host.address}</li>
        {legalInfo.host.website && <li>Site web : {legalInfo.host.website}</li>}
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments du site (textes, images, logo, charte graphique, code) est la
        propriété de {legalInfo.companyName} ou de ses partenaires, et est protégé par le droit
        de la propriété intellectuelle. Toute reproduction ou représentation, totale ou
        partielle, sans autorisation écrite préalable, est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <Link to="/politique-de-confidentialite">politique de confidentialité</Link>, qui
        détaille les données collectées, leurs finalités et les droits dont vous disposez
        au titre du RGPD.
      </p>

      <h2>Responsabilité</h2>
      <p>
        {legalInfo.companyName} s'efforce d'assurer l'exactitude des informations publiées sur
        ce site mais ne saurait être tenue responsable des erreurs, d'une absence de
        disponibilité des informations ou de la présence de virus sur son site. Les tarifs et
        prestations affichés sont donnés à titre indicatif et peuvent évoluer ; seul le devis
        remis après diagnostic fait foi.
      </p>
    </LegalPage>
  );
};

export default MentionsLegales;
