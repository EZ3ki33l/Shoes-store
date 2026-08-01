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

## Déploiement (Docker)

L'application est conçue pour être déployée en conteneur Docker derrière un reverse proxy `nginx-proxy` + `acme-companion` (Let's Encrypt automatique), aux côtés d'autres sites hébergés sur le même serveur.

Fichiers concernés :

- `Dockerfile` : build multi-stage (deps → build Next.js standalone → image finale minimale sur `node:22-alpine`)
- `.dockerignore` : exclut `node_modules`, `.next`, `.git`, `generated`, les fichiers `.env*`, etc. du contexte de build
- `docker-compose.yml` : service `atchaussures`, branché sur le réseau Docker externe de `nginx-proxy`, avec les variables `VIRTUAL_HOST` / `VIRTUAL_PORT` / `LETSENCRYPT_HOST` / `LETSENCRYPT_EMAIL`
- `.env.production.example` : modèle des variables d'environnement à fournir en production (à copier en `.env.production`, jamais commité)

### Étapes sur le serveur

1. Vérifier le nom du réseau Docker externe utilisé par `nginx-proxy` :

   ```bash
   docker network ls
   docker inspect <conteneur-nginx-proxy> --format '{{json .NetworkSettings.Networks}}'
   ```

   Ajuster le nom du réseau dans `docker-compose.yml` (section `networks`) s'il diffère de `nginx-proxy`.

2. Cloner le repo dans `/srv/docker/atchaussures` :

   ```bash
   git clone https://github.com/EZ3ki33l/Shoes-store.git /srv/docker/atchaussures
   cd /srv/docker/atchaussures
   ```

3. Créer `.env.production` à partir du modèle et renseigner les vraies valeurs (`DATABASE_URL` Neon, clés Clerk, `CLERK_WEBHOOKS_SIGNING_SECRET`) :

   ```bash
   cp .env.production.example .env.production
   ```

4. Dans `docker-compose.yml`, ajuster `LETSENCRYPT_EMAIL` avec une adresse email valide (utilisée par Let's Encrypt).

5. Construire et démarrer le conteneur :

   ```bash
   docker compose up -d --build
   ```

6. Vérifier les logs et l'obtention du certificat TLS :

   ```bash
   docker compose logs -f
   ```

7. Configurer un endpoint webhook côté Clerk pointant vers `https://atchaussures.ez3ki33l.ovh/api/webhooks/clerk`, récupérer le signing secret et le renseigner dans `.env.production`, puis redémarrer le conteneur (`docker compose up -d`).

> La base Neon utilisée en dev est réutilisée telle quelle en production (le schéma y est déjà appliqué). Pour les mises à jour de schéma futures, utiliser des migrations Prisma (`prisma migrate deploy`) plutôt que `db push`.

## En savoir plus

Pour en savoir plus sur les technologies utilisées :

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
