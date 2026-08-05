/**
 * Mentions légales (LCEN art. 6) — éditeur, publication, hébergeur.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/app/components/LegalPage'
import { legal } from '@/lib/legal'

export const metadata: Metadata = {
  title: `Mentions légales | ${legal.siteName}`,
  description: `Mentions légales du site ${legal.siteName}.`,
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <p>
        Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l&apos;économie numérique (LCEN), les présentes mentions légales sont portées à la
        connaissance des utilisateurs du site {legal.siteName}.
      </p>
      <p>
        Dernière mise à jour : {legal.lastUpdated}.
      </p>

      <section className="space-y-3">
        <h2>1. Éditeur du site</h2>
        <p>
          Le site {legal.siteName} est édité par :
        </p>
        <ul>
          <li>
            <strong>Raison sociale :</strong> {legal.company.name}
          </li>
          <li>
            <strong>Forme juridique :</strong> {legal.company.legalForm}
          </li>
          <li>
            <strong>Capital social :</strong> {legal.company.shareCapital}
          </li>
          <li>
            <strong>Siège social :</strong> {legal.company.address}
          </li>
          <li>
            <strong>SIRET :</strong> {legal.company.siret}
          </li>
          <li>
            <strong>RCS :</strong> {legal.company.rcs}
          </li>
          <li>
            <strong>N° TVA intracommunautaire :</strong> {legal.company.vatNumber}
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
        <h2>2. Directeur de la publication</h2>
        <p>Le directeur de la publication est : {legal.publicationDirector}.</p>
      </section>

      <section className="space-y-3">
        <h2>3. Hébergeur</h2>
        <p>Le site est hébergé par :</p>
        <ul>
          <li>
            <strong>Nom :</strong> {legal.host.name}
          </li>
          <li>
            <strong>Adresse :</strong> {legal.host.address}
          </li>
          <li>
            <strong>Téléphone :</strong> {legal.host.phone}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>4. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur le site {legal.siteName} (textes, images,
          graphismes, logo, icônes, sons, logiciels, etc.) est protégé par les dispositions du Code
          de la propriété intellectuelle et appartient à {legal.company.name} ou à ses partenaires.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou adaptation de tout ou
          partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite
          sans autorisation écrite préalable de {legal.company.name}.
        </p>
      </section>

      <section className="space-y-3">
        <h2>5. Responsabilité</h2>
        <p>
          {legal.company.name} s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
          informations diffusées sur le site. Toutefois, elle ne saurait être tenue responsable des
          omissions, inexactitudes ou carences dans la mise à jour, qu&apos;elles soient de son fait
          ou du fait de tiers partenaires.
        </p>
        <p>
          L&apos;utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
        </p>
      </section>

      <section className="space-y-3">
        <h2>6. Données personnelles et cookies</h2>
        <p>
          Pour plus d&apos;informations sur le traitement des données personnelles et l&apos;usage
          des cookies, veuillez consulter la{' '}
          <Link href="/confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </Link>{' '}
          et la{' '}
          <Link href="/cookies" className="underline underline-offset-2">
            politique cookies
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  )
}
