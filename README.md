# G&C Tech - Plateforme d'E-commerce d'Électronique

Une plateforme d'e-commerce haute gamme et performante pour la vente d'électronique, développée avec les dernières technologies web modernes.

## 🌟 Caractéristiques Principales

### 🛍️ Fonctionnalités Client

- **Catalogue de Produits** : Smartphones, ordinateurs, tablettes, casques, écouteurs, montres connectées
- **Recherche et Filtrage** : Filtres avancés par catégorie, prix, spécifications
- **Pages Produits Détaillées** : Descriptions complètes, images, spécifications techniques
- **Panier d'Achat** : Gestion dynamique du panier avec persistance
- **Système de Favoris** : Wishlist personnalisée pour chaque utilisateur
- **Authentification Complète** : Inscription, connexion, réinitialisation de mot de passe
- **Système de Paiement** : Intégration FedaPay pour les transactions sécurisées
- **Support Multilingue** : Changement de langue en temps réel
- **Gestion des Devises** : Conversion dynamique des prix
- **Responsive Design** : Interface optimisée pour desktop et mobile

### 💰 Système d'Épargne (Tontine)

- Plans d'épargne collaborative personnalisés
- Gestion des contributions
- Suivi du statut des plans
- Interface dédiée pour les détails de plan

### 👨‍💼 Panneau Admin

- **Gestion des Produits** : CRUD complet pour le catalogue
- **Gestion des Commandes** : Suivi et traitement des commandes
- **Gestion des Utilisateurs** : Administration des profils client
- **Gestion de l'Épargne** : Supervision des plans de tontine
- **Paramètres Système** : Configuration générale de la plateforme

### 📄 Pages Légales

- Politique de Confidentialité
- Conditions d'Utilisation
- Politique de Remboursement
- Avis Légal
- Politique de Cookies
- Centre d'Aide & FAQ
- Informations d'Expédition
- Formulaire de Contact

## 🛠️ Stack Technologique

### Frontend

- **React 19** - Framework UI
- **TypeScript 5.8** - Typage statique
- **Vite 6** - Bundler et serveur de développement
- **React Router 7** - Routage client
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icônes SVG
- **Motion** - Animations fluides
- **React Icons** - Bibliothèque d'icônes

### Backend & Base de Données

- **Supabase** - Backend-as-a-Service (PostgreSQL)
- **Supabase Functions** - Fonctions serverless
- **FedaPay** - Intégration de paiement

### API & IA

- **Google Gemini API** - Intégration IA

### State Management

- **React Context API** - Gestion d'état globale
  - `AuthContext` - Authentification et autorisation
  - `CartContext` - Gestion du panier
  - `CatalogContext` - Données du catalogue
  - `CurrencyContext` - Conversion de devises
  - `LanguageContext` - Localisation
  - `WishlistContext` - Favoris utilisateur

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Clé API Google Gemini
- Compte FedaPay (pour les paiements)

### Étapes d'Installation

1. **Cloner le repository**

   ```bash
   git clone <url-du-repo>
   cd G-C-Tech
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env` à la racine du projet :

   ```env
   VITE_SUPABASE_URL=<votre-url-supabase>
   VITE_SUPABASE_ANON_KEY=<votre-clé-supabase>
   GEMINI_API_KEY=<votre-clé-gemini>
   VITE_FEDAPAY_PUBLIC_KEY=<votre-clé-fedapay>
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera disponible à `http://localhost:3000`

## 🚀 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Aperçu de la build de production
npm run preview

# Nettoyer les fichiers de build
npm run clean

# Vérifier les types TypeScript
npm run lint
```

## 📁 Structure du Projet

```
src/
├── components/        # Composants réutilisables
│   ├── AdminLayout.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── FilterBar.tsx
│   └── ...
├── contexts/         # Contextes React
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── CatalogContext.tsx
│   ├── CurrencyContext.tsx
│   ├── LanguageContext.tsx
│   └── WishlistContext.tsx
├── lib/             # Logique métier et utilitaires
│   ├── admin.ts
│   ├── catalog.ts
│   ├── orders.ts
│   ├── payment.ts
│   ├── supabase.ts
│   ├── tontine.ts
│   └── utils.ts
├── pages/           # Pages principales
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── Cart.tsx
│   ├── Login.tsx
│   ├── Tontine.tsx
│   └── admin/      # Pages admin
└── App.tsx

supabase/
├── migrations/      # Migrations de base de données
└── functions/       # Fonctions serverless
    ├── create-payment/
    └── fedapay-webhook/
```

## 🔐 Authentification

L'application utilise Supabase Auth pour gérer l'authentification :

- Inscription avec email/mot de passe
- Connexion sécurisée
- Réinitialisation de mot de passe
- Gestion des rôles utilisateur (admin/client)

## 💳 Paiement

Intégration FedaPay pour les transactions :

- Webhook pour confirmation de paiement
- Gestion de l'idempotence des paiements
- Création sécurisée des sessions de paiement

## 🌐 Localisation

Support complet du multilingue et multi-devises :

- Changement de langue en temps réel
- Conversion de devises automatique
- Contenu adapté par locale

## 📱 Performance

- **Code Splitting** : Pages chargées à la demande
- **Lazy Loading** : Composants chargés dynamiquement
- **Optimisation** : Images et ressources optimisées
- **Vite** : Build rapide et HMR (Hot Module Replacement)

## 📊 Base de Données

Schéma PostgreSQL avec :

- Tables pour produits, commandes, utilisateurs
- Tables pour l'épargne (tontine)
- Tables pour les favoris
- Gestion des paramètres système
- Politiques RLS (Row Level Security)

## 🚀 Déploiement

L'application est configurée pour le déploiement sur **Vercel** :

- Configuration présente dans `vercel.json`
- Deployment automatique depuis le repository
- Variables d'environnement gérées dans Vercel

## 📝 Licence

À définir

## 👥 Support & Contact

Pour toute question ou problème, veuillez contacter : support@gctech.com

---

**Dernière mise à jour** : 2026
