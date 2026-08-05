/**
 * Politique de confidentialité — RGPD.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/app/components/LegalPage'
import { legal } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Politique de confidentialité | ${legal.siteName}`,
  description: `Politique de confidentialité et protection des données de ${legal.siteName}.`,
}

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        La présente politique décrit la manière dont {legal.company.name} (ci-après « nous »)
        collecte, utilise et protège les données personnelles des utilisateurs du site{' '}
        {legal.siteName}, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique
        et Libertés.
      </p>
      <p>Dernière mise à jour : {legal.lastUpdated}.</p>

      <section className="space-y-3">
        <h2>1. Responsable du traitement</h2>
        <ul>
          <li>
            <strong>Responsable :</strong> {legal.company.name}
          </li>
          <li>
            <strong>Adresse :</strong> {legal.company.address}
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
        <h2>2. Données collectées</h2>
        <p>Nous pouvons être amenés à collecter notamment :</p>
        <ul>
          <li>
            <strong>Données de compte :</strong> identité, adresse email, informations de profil
            synchronisées via notre prestataire d&apos;authentification Clerk.
          </li>
          <li>
            <strong>Données de commande :</strong> adresse de livraison et de facturation, historique
            d&apos;achats, montants.
          </li>
          <li>
            <strong>Données de paiement :</strong> traitées par Stripe ; nous ne stockons pas les
            numéros de carte bancaire.
          </li>
          <li>
            <strong>Données de navigation :</strong> logs techniques, cookies (voir la{' '}
            <Link href="/cookies" className="underline underline-offset-2">
              politique cookies
            </Link>
            ).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>3. Finalités et bases légales</h2>
        <ul>
          <li>
            <strong>Gestion du compte et authentification</strong> — exécution du contrat /
            mesures précontractuelles.
          </li>
          <li>
            <strong>Traitement des commandes et livraisons</strong> — exécution du contrat.
          </li>
          <li>
            <strong>Paiement et lutte contre la fraude</strong> — exécution du contrat et intérêt
            légitime.
          </li>
          <li>
            <strong>Service client et réclamations</strong> — exécution du contrat et obligation
            légale.
          </li>
          <li>
            <strong>Obligations comptables et fiscales</strong> — obligation légale.
          </li>
          <li>
            <strong>Amélioration du site</strong> — intérêt légitime, ou consentement lorsque
            requis (cookies non essentiels).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>4. Destinataires</h2>
        <p>Les données peuvent être communiquées, dans la limite nécessaire, à :</p>
        <ul>
          <li>nos prestataires techniques (hébergement, Clerk, Stripe, UploadThing) ;</li>
          <li>les transporteurs pour la livraison ;</li>
          <li>les autorités compétentes sur demande légale.</li>
        </ul>
        <p>
          Nous ne vendons pas les données personnelles à des tiers à des fins commerciales.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Transferts hors UE</h2>
        <p>
          Certains prestataires (notamment Clerk ou Stripe) peuvent traiter des données hors de
          l&apos;Union européenne. Dans ce cas, des garanties appropriées sont mises en place
          (clauses contractuelles types, etc.) conformément au RGPD.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Durée de conservation</h2>
        <ul>
          <li>
            <strong>Compte client :</strong> pendant la durée de la relation commerciale, puis
            archivage selon les délais légaux.
          </li>
          <li>
            <strong>Commandes et facturation :</strong> durée légale de conservation comptable
            (généralement 10 ans).
          </li>
          <li>
            <strong>Données de prospection :</strong> 3 ans à compter du dernier contact, sauf
            opposition.
          </li>
          <li>
            <strong>Logs techniques :</strong> durée limitée nécessaire à la sécurité et au
            diagnostic.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>7. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement,
          limitation, opposition, portabilité, et droit de retirer votre consentement lorsque le
          traitement repose sur celui-ci.
        </p>
        <p>
          Pour exercer vos droits, contactez-nous à {legal.contact.email} en joignant une preuve
          d&apos;identité si nécessaire. Vous pouvez également introduire une réclamation auprès de
          la CNIL (
          <a
            href="https://www.cnil.fr"
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </section>

      <section className="space-y-3">
        <h2>8. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
          protéger les données personnelles contre la perte, l&apos;accès non autorisé, la
          divulgation ou l&apos;altération.
        </p>
      </section>
    </LegalPage>
  )
}
