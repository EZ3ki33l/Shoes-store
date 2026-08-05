/**
 * Footer site : liens légaux FR, contact, copyright et accès admin (si ADMIN).
 */

import Link from 'next/link'
import Typo from './Typography'
import AdminFooterLink from './adminFooterLink'
import { legal } from '@/lib/legal'

const legalLinks = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgv', label: 'CGV' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/cookies', label: 'Politique cookies' },
] as const

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-border mx-0 mt-auto border-t py-10 md:mx-8 lg:mx-16 xl:mx-24">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Typo variant="label" as="p">
            {legal.siteName}
          </Typo>
          <Typo variant="caption" as="p">
            © {year} {legal.siteName}. Tous droits réservés.
          </Typo>
          <div className="ml- flex">
            <AdminFooterLink />
          </div>
        </div>

        <nav aria-label="Informations légales" className="space-y-2">
          <Typo variant="label" as="p">
            Informations légales
          </Typo>
          <ul className="space-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2">
          <Typo variant="label" as="p">
            Contact
          </Typo>
          <Typo variant="caption" as="p">
            {legal.contact.email}
          </Typo>
          <Typo variant="caption" as="p">
            {legal.contact.phone}
          </Typo>
        </div>
      </div>
    </footer>
  )
}
