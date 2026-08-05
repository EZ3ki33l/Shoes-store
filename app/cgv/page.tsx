/**
 * Conditions générales de vente — cadre e-commerce FR.
 */

import type { Metadata } from 'next'
import LegalPage from '@/app/components/LegalPage'
import { legal } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Conditions générales de vente | ${legal.siteName}`,
  description: `Conditions générales de vente de ${legal.siteName}.`,
}

export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente">
      <p>
        Les présentes conditions générales de vente (ci-après « CGV ») régissent les ventes
        conclues entre {legal.company.name} et tout consommateur (ci-après « le Client ») via le
        site {legal.siteName}.
      </p>
      <p>Dernière mise à jour : {legal.lastUpdated}.</p>

      <section className="space-y-3">
        <h2>1. Objet</h2>
        <p>
          Les CGV définissent les droits et obligations des parties dans le cadre de la vente en
          ligne de chaussures et accessoires proposés sur le site {legal.siteName}.
        </p>
        <p>
          Toute commande implique l&apos;acceptation sans réserve des présentes CGV. {legal.company.name}{' '}
          se réserve le droit de les modifier à tout moment ; la version applicable est celle en
          vigueur au jour de la commande.
        </p>
      </section>

      <section className="space-y-3">
        <h2>2. Identité du vendeur</h2>
        <ul>
          <li>
            <strong>Société :</strong> {legal.company.name} ({legal.company.legalForm})
          </li>
          <li>
            <strong>Siège :</strong> {legal.company.address}
          </li>
          <li>
            <strong>SIRET :</strong> {legal.company.siret}
          </li>
          <li>
            <strong>RCS :</strong> {legal.company.rcs}
          </li>
          <li>
            <strong>Email :</strong> {legal.contact.email}
          </li>
          <li>
            <strong>Téléphone :</strong> {legal.contact.phone}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>3. Produits</h2>
        <p>
          Les produits proposés sont ceux figurant sur le site au moment de la consultation, dans la
          limite des stocks disponibles. Les photographies et descriptions sont aussi fidèles que
          possible mais n&apos;entrent pas dans le champ contractuel.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Prix</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). {legal.company.name} se
          réserve le droit de modifier ses prix à tout moment ; le prix applicable est celui affiché
          au moment de la validation de la commande.
        </p>
        <p>
          Les frais de livraison éventuels sont précisés avant la validation définitive de la
          commande.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Commande</h2>
        <p>
          Le Client passe commande en sélectionnant les produits, en renseignant les informations
          nécessaires (livraison, paiement) et en validant le récapitulatif. La confirmation de
          commande vaut acceptation des CGV et du prix.
        </p>
        <p>
          {legal.company.name} se réserve le droit de refuser ou d&apos;annuler toute commande
          anormale, frauduleuse ou en cas d&apos;indisponibilité des produits.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne par les moyens proposés sur le site (notamment via
          Stripe). La commande n&apos;est définitive qu&apos;après encaissement effectif du prix.
        </p>
      </section>

      <section className="space-y-3">
        <h2>7. Livraison</h2>
        <p>
          Les produits sont livrés à l&apos;adresse indiquée par le Client lors de la commande. Les
          délais indiqués sont des délais moyens indicatifs. En cas de retard important, le Client
          peut contacter le service client à {legal.contact.email}.
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Droit de rétractation</h2>
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client
          dispose d&apos;un délai de quatorze (14) jours à compter de la réception du produit pour
          exercer son droit de rétractation, sans avoir à motiver sa décision.
        </p>
        <p>
          Pour exercer ce droit, le Client informe {legal.company.name} de sa décision par
          déclaration dénuée d&apos;ambiguïté (email à {legal.contact.email} ou formulaire dédié
          le cas échéant). Les produits doivent être renvoyés dans leur état d&apos;origine, complets
          et dans un emballage permettant un transport en bon état.
        </p>
        <p>
          Le remboursement intervient dans un délai de quatorze (14) jours à compter de la
          récupération des produits ou de la preuve d&apos;expédition, selon la première de ces
          dates.
        </p>
      </section>

      <section className="space-y-3">
        <h2>9. Garanties</h2>
        <p>
          Les produits bénéficient de la garantie légale de conformité (articles L.217-3 et
          suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et
          suivants du Code civil).
        </p>
      </section>

      <section className="space-y-3">
        <h2>10. Responsabilité</h2>
        <p>
          {legal.company.name} ne saurait être tenue responsable des dommages résultant d&apos;une
          mauvaise utilisation des produits, d&apos;une force majeure ou d&apos;un fait du Client
          ou d&apos;un tiers.
        </p>
      </section>

      <section className="space-y-3">
        <h2>11. Médiation de la consommation</h2>
        <p>
          Conformément aux articles L.611-1 et suivants du Code de la consommation, le Client peut
          recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable
          d&apos;un litige, après avoir tenté de résoudre le différend auprès du service client.
        </p>
        <ul>
          <li>
            <strong>Médiateur :</strong> {legal.mediator.name}
          </li>
          <li>
            <strong>Site :</strong> {legal.mediator.website}
          </li>
          <li>
            <strong>Adresse :</strong> {legal.mediator.address}
          </li>
        </ul>
        <p>
          La plateforme européenne de règlement en ligne des litiges est également accessible à
          l&apos;adresse :{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2>12. Droit applicable</h2>
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige et à défaut
          d&apos;accord amiable, les tribunaux français compétents seront seuls compétents.
        </p>
      </section>
    </LegalPage>
  )
}
