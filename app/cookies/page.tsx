/**
 * Politique cookies — first-party, prestataires (Clerk/Stripe), restriction des cookies tiers.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/app/components/LegalPage'
import { legal } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Politique cookies | ${legal.siteName}`,
  description: `Politique d’utilisation des cookies sur ${legal.siteName}.`,
}

export default function CookiesPage() {
  return (
    <LegalPage title="Politique cookies">
      <p>
        La présente politique explique comment {legal.siteName}, édité par {legal.company.name},
        utilise des cookies et technologies similaires lorsque vous naviguez sur le site.
      </p>
      <p>Dernière mise à jour : {legal.lastUpdated}.</p>

      <section className="space-y-3">
        <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone,
          tablette) lors de la visite d&apos;un site. Il permet de reconnaître le navigateur,
          mémoriser des préférences ou assurer le bon fonctionnement de certains services.
        </p>
        <ul>
          <li>
            <strong>Cookies first-party :</strong> déposés par le domaine du site que vous
            consultez ({legal.siteName}).
          </li>
          <li>
            <strong>Cookies third-party :</strong> déposés par un domaine tiers (souvent utilisés
            pour la publicité ou le suivi cross-site). Les navigateurs les restreignent
            progressivement.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>2. Cookies utilisés sur ce site</h2>

        <h3 className="font-sans text-base font-semibold text-foreground">
          Cookies strictement nécessaires (first-party)
        </h3>
        <p>
          Indispensables au fonctionnement du site (session, sécurité, authentification, panier le
          cas échéant). Ils ne nécessitent pas votre consentement.
        </p>
        <ul>
          <li>
            <strong>Authentification (Clerk) :</strong> maintien de la session connectée et
            sécurité du compte, principalement via des cookies first-party sur notre domaine (ou
            des mécanismes équivalents fournis par le prestataire).
          </li>
          <li>
            <strong>Préférences techniques :</strong> par exemple le thème clair/sombre stocké
            localement sur votre terminal.
          </li>
        </ul>

        <h3 className="font-sans text-base font-semibold text-foreground">
          Prestataires de paiement
        </h3>
        <p>
          Le paiement est traité par Stripe. Lors du paiement, vous pouvez être redirigé vers une
          page Stripe ou interagir avec des éléments de paiement sécurisés. Ces échanges s&apos;appuient
          sur des mécanismes propres à Stripe (cookies ou stockage sur le domaine de paiement), et
          non sur du tracking publicitaire cross-site. Stripe dispose de sa propre politique de
          confidentialité.
        </p>

        <h3 className="font-sans text-base font-semibold text-foreground">
          Mesure d&apos;audience et publicité
        </h3>
        <p>
          À ce jour, le site ne dépose pas de cookies publicitaires ni de cookies de tracking
          cross-site. Si des outils de mesure d&apos;audience non exemptés (ou des partenaires
          publicitaires) étaient ajoutés ultérieurement, ils ne seraient activés qu&apos;avec votre
          consentement préalable, via un bandeau ou un mécanisme équivalent.
        </p>
      </section>

      <section className="space-y-3">
        <h2>3. Restriction progressive des cookies tiers</h2>
        <p>
          Les principaux navigateurs (Safari, Firefox, et de plus en plus Chrome) limitent ou
          bloquent les cookies third-party afin de réduire le suivi entre sites. Cela concerne
          surtout la publicité ciblée et le retargeting, pas le fonctionnement de votre compte ou
          de votre commande sur {legal.siteName}.
        </p>
        <p>
          Nos services essentiels (connexion, panier, paiement) reposent sur des cookies ou
          technologies first-party, ou sur des flux dédiés (redirection / éléments de paiement).
          La restriction des cookies tiers n&apos;empêche donc pas, en principe, l&apos;usage
          normal du site.
        </p>
      </section>

      <section className="space-y-3">
        <h2>4. Durée de conservation</h2>
        <p>
          Les cookies ont une durée de vie limitée. Les cookies de session expirent à la fermeture
          du navigateur. Les cookies persistants sont conservés pour une durée adaptée à leur
          finalité, et en tout état de cause dans les limites recommandées par la CNIL.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Gestion de vos préférences</h2>
        <p>Vous pouvez à tout moment :</p>
        <ul>
          <li>
            configurer votre navigateur pour accepter, refuser ou supprimer les cookies (les
            paramètres varient selon Chrome, Firefox, Safari, Edge, etc.) ;
          </li>
          <li>
            retirer votre consentement pour les cookies non essentiels lorsque un mécanisme de
            gestion du consentement est proposé sur le site.
          </li>
        </ul>
        <p>
          Le refus des cookies strictement nécessaires peut empêcher certaines fonctions (par
          exemple rester connecté). Le refus des cookies non essentiels n&apos;affecte pas
          l&apos;accès aux contenus principaux du site.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Plus d&apos;informations</h2>
        <p>
          Pour toute question relative aux cookies ou à vos données personnelles, contactez-nous à{' '}
          {legal.contact.email}. Consultez également notre{' '}
          <Link href="/confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </Link>
          .
        </p>
        <p>
          Ressources CNIL :{' '}
          <a
            href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
            className="underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            Cookies et autres traceurs
          </a>
          .
        </p>
      </section>
    </LegalPage>
  )
}
