'use client'

import { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { ChevronDownIcon, MenuIcon } from 'lucide-react'

type Props = {
  brands: { name: string; slug: string }[]
  categories: {
    name: string
    slug: string
    children: { name: string; slug: string }[]
  }[]
  audiences: string[]
}

const AUDIENCE_LABELS: Record<string, string> = {
  HOMME: 'Homme',
  FEMME: 'Femme',
  ENFANT: 'Enfant',
  UNISEXE: 'Unisexe',
}

export default function ClientNav({ brands, categories, audiences }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop — lg+ uniquement (tablette trop étroite pour la rangée complète) */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {audiences.map((a) => (
            <NavigationMenuItem key={a}>
              <NavigationMenuTrigger>{AUDIENCE_LABELS[a]}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-72 gap-3 p-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <NavigationMenuLink
                        href={`/audience/${a.toLowerCase()}/${cat.slug}`}
                        render={<Link href={`/audience/${a.toLowerCase()}/${cat.slug}`} />}
                        className="font-medium"
                      >
                        {cat.name}
                      </NavigationMenuLink>
                      {cat.children.length > 0 && (
                        <ul className="mt-1 ml-2 flex flex-col gap-1">
                          {cat.children.map((sub) => (
                            <li key={sub.slug}>
                              <NavigationMenuLink
                                href={`/audience/${a.toLowerCase()}/${sub.slug}`}
                                render={<Link href={`/audience/${a.toLowerCase()}/${sub.slug}`} />}
                                className="text-muted-foreground text-sm"
                              >
                                {sub.name}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuTrigger>Marques</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-64">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <NavigationMenuLink
                      href={`/marques/${b.slug}`}
                      render={<Link href={`/marques/${b.slug}`} />}
                    >
                      {b.name}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/promotions"
              className={navigationMenuTriggerStyle()}
              render={<Link href="/promotions" />}
            >
              Promotions
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="text-foreground/60 hover:bg-muted inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-2 transition-colors lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="gap-0 overflow-y-auto p-0">
          <SheetHeader className="border-border border-b">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Navigation principale" className="flex flex-col px-2 py-2">
            {audiences.map((a) => (
              <details key={a} className="group border-border border-b">
                <summary className="hover:bg-muted flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {AUDIENCE_LABELS[a]}
                  <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="flex flex-col gap-1 pb-3 pl-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/audience/${a.toLowerCase()}/${cat.slug}`}
                        className="hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium"
                        onClick={() => setOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {cat.children.length > 0 && (
                        <ul className="ml-2 flex flex-col gap-0.5">
                          {cat.children.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                href={`/audience/${a.toLowerCase()}/${sub.slug}`}
                                className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-1.5 text-sm"
                                onClick={() => setOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}

            <details className="group border-border border-b">
              <summary className="hover:bg-muted flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                Marques
                <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="flex flex-col gap-0.5 pb-3 pl-3">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/marques/${b.slug}`}
                      className="hover:bg-muted block rounded-md px-3 py-2 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <Link
              href="/promotions"
              className="hover:bg-muted rounded-md px-3 py-3 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              Promotions
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
