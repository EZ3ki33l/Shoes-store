import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import ThemeToggle from './components/ThemeToggle'
import Wordmark from './components/Wordmark'
import Image from 'next/image'
import logo from '../public/logo-AT-Chaussures.svg'
import logoDark from '../public/logo-AT-Chaussures-dark.svg'
import Typo from './components/Typography'
import Link from 'next/link'
import AdminFooterLink from './components/adminFooterLink'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AT Chaussures',
  description: 'Magasin de chaussures en ligne',
  icons: {
    icon: '/logo-AT-Chaussures.svg',
  },
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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="mx-32 flex min-h-full flex-col">
        <ClerkProvider>
          <header className="flex h-16 items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image src={logo} alt="" className="h-10 w-auto dark:hidden" />
                <Image src={logoDark} alt="" className="hidden h-10 w-auto dark:block" />
              </Link>
              <Wordmark />
            </div>
            <div className="flex items-center justify-center gap-4 p-4">
              <ThemeToggle />

              <Show when="signed-out">
                <div className="flex h-10 gap-2 rounded-full bg-neutral-200 pl-4 sm:h-12 dark:bg-neutral-700">
                  <SignInButton />
                  <SignUpButton>
                    <button className="h-10 cursor-pointer rounded-full bg-purple-700 px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          <main className="flex-1 py-10">{children}</main>
          <footer className="flex h-20 items-center justify-center gap-4">
            <Typo variant="label" className="text-center">
              copyright © 2026 AT Chaussures
            </Typo>
            <AdminFooterLink />
          </footer>
        </ClerkProvider>
      </body>
    </html>
  )
}
