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

L'application est conçue pour être déployée en conteneur Docker sur le serveur, avec le TLS géré par un **Nginx installé sur l'hôte** (pas en Docker) + **Certbot**, sur le modèle des autres sites déjà hébergés (`sites-available` / `sites-enabled`, un certificat par domaine). Le conteneur ne publie son port que sur `127.0.0.1`, jamais directement sur l'extérieur.

Fichiers concernés :

- `Dockerfile` : build multi-stage (deps → build Next.js standalone → image finale minimale sur `node:22-alpine`)
- `.dockerignore` : exclut `node_modules`, `.next`, `.git`, `generated`, les fichiers `.env*`, etc. du contexte de build
- `docker-compose.yml` : service `atchaussures`, publie `127.0.0.1:3001` → port `3000` du conteneur
- `.env.production.example` : modèle des variables d'environnement à fournir en production (à copier en `.env.production`, jamais commité)

### Étapes sur le serveur

1. Cloner le repo dans `/srv/docker/atchaussures` :

   ```bash
   git clone https://github.com/EZ3ki33l/Shoes-store.git /srv/docker/atchaussures
   cd /srv/docker/atchaussures
   ```

2. Créer `.env.production` à partir du modèle et renseigner les vraies valeurs (`DATABASE_URL` Neon, clés Clerk, `CLERK_WEBHOOKS_SIGNING_SECRET`) :

   ```bash
   cp .env.production.example .env.production
   ```

3. Construire et démarrer le conteneur :

   ```bash
   docker compose up -d --build
   ```

4. Créer la config Nginx du site (`/etc/nginx/sites-available/atchaussures.ez3ki33l.ovh`) :

   ```nginx
   server {
       listen 80;
       server_name atchaussures.ez3ki33l.ovh;

       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. Activer le site et recharger Nginx :

   ```bash
   sudo ln -s /etc/nginx/sites-available/atchaussures.ez3ki33l.ovh /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

6. Générer le certificat TLS avec Certbot (réécrit automatiquement la config pour ajouter le bloc HTTPS et la redirection 80→443) :

   ```bash
   sudo certbot --nginx -d atchaussures.ez3ki33l.ovh
   ```

7. Configurer un endpoint webhook côté Clerk pointant vers `https://atchaussures.ez3ki33l.ovh/api/webhooks/clerk`, récupérer le signing secret et le renseigner dans `.env.production`, puis redémarrer le conteneur (`docker compose up -d`).

> La base Neon utilisée en dev est réutilisée telle quelle en production (le schéma y est déjà appliqué). Pour les mises à jour de schéma futures, utiliser des migrations Prisma (`prisma migrate deploy`) plutôt que `db push`.

## En savoir plus

Pour en savoir plus sur les technologies utilisées :

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
