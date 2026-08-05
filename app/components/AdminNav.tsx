'use client'

/**
 * Navigation admin (NavigationMenu) : tableau de bord + menu Catalogue.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const catalogLinks = [
  {
    href: '/admin/brands',
    label: 'Marques',
    description: 'Logos et noms des marques',
  },
  {
    href: '/admin/categories',
    label: 'Catégories',
    description: 'Arborescence des produits',
  },
  {
    href: '/admin/products',
    label: 'Produits',
    description: 'Catalogue, variantes et images',
  },
] as const

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="max-w-full">
      <NavigationMenuList className="flex-wrap justify-center">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/admin"
            active={pathname === '/admin'}
            closeOnClick
            className={navigationMenuTriggerStyle()}
            render={<Link href="/admin" />}
          >
            Tableau de bord
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-64">
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <NavigationMenuLink
                    href={link.href}
                    active={pathname.startsWith(link.href)}
                    closeOnClick
                    className="flex-col items-start gap-0.5 rounded-none"
                    render={<Link href={link.href} />}
                  >
                    <span className="font-medium">{link.label}</span>
                    <span className="text-xs text-muted-foreground">{link.description}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
