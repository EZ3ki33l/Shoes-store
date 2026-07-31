# AT Chaussures

Boutique de chaussures en ligne construite avec [Next.js](https://nextjs.org) (App Router), [Prisma](https://www.prisma.io) et PostgreSQL, [Clerk](https://clerk.com) pour l'authentification et [Stripe](https://stripe.com) pour les paiements.

## Stack technique

- **Framework** : Next.js 16 (App Router, React 19)
- **Style** : Tailwind CSS 4
- **Base de données** : PostgreSQL via Prisma ORM
- **Authentification** : Clerk
- **Paiements** : Stripe
- **Qualité de code** : ESLint + Prettier (avec le plugin Tailwind)

## Prérequis

- Node.js 20+
- pnpm
- Une base de données PostgreSQL
- Des clés API Clerk et Stripe

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Installation

Installez les dépendances :

```bash
pnpm install
```

Appliquez le schéma Prisma à votre base de données :

```bash
pnpm prisma migrate dev
```

## Démarrage

Lancez le serveur de développement :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Scripts disponibles

- `pnpm dev` — démarre le serveur de développement
- `pnpm build` — construit l'application pour la production
- `pnpm start` — démarre le serveur en mode production
- `pnpm lint` — vérifie le code avec ESLint
- `pnpm format` — formate le code avec Prettier
- `pnpm format:check` — vérifie le formatage sans modifier les fichiers

## Structure du projet

```
app/                  # Pages et composants (App Router)
  components/         # Composants réutilisables (Typography, ThemeToggle, Wordmark...)
prisma/
  schema.prisma       # Schéma de données (utilisateurs, catalogue, commandes, paiements...)
public/               # Assets statiques (logos, wordmarks...)
```

## Modèle de données

Le schéma Prisma (`prisma/schema.prisma`) couvre l'ensemble du domaine métier :

- **Utilisateurs & adresses** : profils synchronisés avec Clerk, carnet d'adresses
- **Catalogue** : marques, catégories, produits et variantes (taille/couleur)
- **Panier & commandes** : panier, commandes, paiements Stripe
- **Avis & liste de souhaits**
- **Promotions** : coupons de réduction
- **Stock** : historique des mouvements (réassort, vente, retour, ajustement)
- **Retours & remboursements**
- **Notifications & newsletter**

## En savoir plus

Pour en savoir plus sur les technologies utilisées :

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
