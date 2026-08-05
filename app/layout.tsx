/**
 * Layout racine de l'application AT Chaussures.
 * Configure les polices, Clerk (auth), UploadThing (SSR), le header et le footer.
 */

import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Barlow, Barlow_Condensed, Geist } from 'next/font/google'
import './globals.css'
import ThemeToggle from './components/ThemeToggle'
import Image from 'next/image'
import logo from '../public/logo-AT-Chaussures.svg'
import logoDark from '../public/logo-AT-Chaussures-dark.svg'
import Link from 'next/link'
import SiteFooter from './components/SiteFooter'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from './api/uploadthing/core'
import { cn } from '@/lib/utils'
import Wordmark from './components/Wordmark'
import SiteHeader from './components/siteHeader'
import SearchBar from './components/SearchBar'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

/**
 * Titres — condensée athletic (proche du wordmark gras/italique).
 * Fallbacks : Arial Narrow, Impact, Haettenschweiler…
 */
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
})

/**
 * Corps — même famille, lisible en UI.
 * Fallbacks : Helvetica Neue, Arial…
 */
const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AT Chaussures',
  description: 'Magasin de chaussures en ligne',
  icons: {
    icon: '/logo-AT-Chaussures.svg',
  },
  // Empêche l'extension Dark Reader d'écraser le thème natif clair/sombre
  other: {
    'darkreader-lock': 'true',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr-FR"
      className={cn(
        'h-full',
        'antialiased',
        barlowCondensed.variable,
        barlow.variable,
        'font-sans',
        geist.variable,
      )}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden px-4 font-sans sm:px-6 md:px-10 lg:px-16">
        <ClerkProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <header className="flex h-16 items-center justify-between gap-2 py-4 sm:gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/" className="shrink-0">
                <Image src={logo} alt="" className="h-8 w-auto sm:h-10 dark:hidden" />
                <Image src={logoDark} alt="" className="hidden h-8 w-auto sm:h-10 dark:block" />
              </Link>
            </div>
            <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-4 sm:p-4">
              <ThemeToggle />

              <Show when="signed-out">
                <div className="bg-muted flex h-10 gap-1 rounded-full pl-2 sm:h-12 sm:gap-2 sm:pl-4">
                  <SignInButton>
                    <button
                      type="button"
                      className="text-foreground h-10 cursor-pointer px-2 text-sm font-medium sm:h-12 sm:text-base"
                    >
                      Connexion
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button
                      type="button"
                      className="bg-primary text-primary-950 h-10 cursor-pointer rounded-full px-3 text-sm font-medium sm:h-12 sm:px-5 sm:text-base"
                    >
                      S&apos;inscrire
                    </button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          <main className="flex-1 pb-10">
            {/* lg+ : rangée desktop ; tablette/mobile : wordmark + menu, search en dessous */}
            <div className="flex flex-col gap-4 pt-6 pb-10 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:pt-8 lg:pb-20">
              <div className="flex w-full min-w-0 items-center justify-between gap-4 lg:w-auto lg:justify-center lg:gap-10">
                <Wordmark className="shrink-0" />
                <SiteHeader />
              </div>
              <SearchBar />
            </div>
            <div className="mx-0 flex-1 md:mx-8 lg:mx-16 xl:mx-24">{children}</div>
          </main>
          <SiteFooter />
        </ClerkProvider>
      </body>
    </html>
  )
}
