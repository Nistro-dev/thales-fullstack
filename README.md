# Thales Project

[![CI Production](https://github.com/USERNAME/thales/actions/workflows/ci-deploy-prod.yml/badge.svg?branch=main)](https://github.com/USERNAME/thales/actions/workflows/ci-deploy-prod.yml)
[![CI Development](https://github.com/USERNAME/thales/actions/workflows/ci-dev.yml/badge.svg?branch=dev)](https://github.com/USERNAME/thales/actions/workflows/ci-dev.yml)

Un projet fullstack moderne avec React et Fastify.

## 🏗️ Architecture

### Frontend (`/frontend`)
- **React 19** avec **TypeScript**
- **Vite** pour le bundling et le développement
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- Architecture en couches avec composants, hooks, services

### Backend (`/backend`)
- **Fastify** avec **TypeScript**
- **Sequelize** comme ORM
- **MySQL** comme base de données
- **Swagger** pour la documentation API
- **Multer** pour l'upload de fichiers
- Architecture MVC avec routes, controllers, services

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PNPM 
- MySQL (pour la base de données)

### Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd thales
   ```

2. **Installer les dépendances**
   ```bash
   # Frontend
   cd frontend
   pnpm install
   
   # Backend
   cd ../backend
   pnpm install
   ```

3. **Configuration de la base de données**
   - Créer une base de données MySQL nommée `thales_db`
   - Copier `.env.example` vers `.env` dans le dossier backend
   - Modifier les paramètres de connexion dans `.env`

4. **Démarrer les serveurs**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   pnpm dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

## 📚 URLs importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Documentation Swagger**: http://localhost:3000/documentation
- **Health Check**: http://localhost:3000/api/health

## 📁 Structure du projet

```
thales/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── services/      # Services API
│   │   ├── types/         # Types TypeScript
│   │   └── utils/         # Utilitaires
│   ├── public/
│   └── package.json
│
├── backend/               # API Fastify
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Contrôleurs
│   │   ├── models/        # Modèles Sequelize
│   │   ├── services/      # Services métier
│   │   ├── middleware/    # Middlewares
│   │   ├── config/        # Configuration
│   │   └── types/         # Types TypeScript
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🛠️ Scripts disponibles

### Frontend
- `pnpm dev` - Serveur de développement
- `pnpm build` - Build de production
- `pnpm preview` - Prévisualisation du build
- `pnpm lint` - Linting ESLint
- `pnpm test` - Tests unitaires
- `pnpm type-check` - Vérification des types TypeScript

### Backend
- `pnpm dev` - Serveur de développement avec auto-reload
- `pnpm build` - Compilation TypeScript
- `pnpm start` - Démarrage en production
- `pnpm lint` - Linting ESLint
- `pnpm test` - Tests unitaires
- `pnpm type-check` - Vérification des types TypeScript

### Projet global
- `./test-all.sh` - Lance tous les tests frontend et backend

## 🚀 CI/CD

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement :

### Workflow Production (main)
- **Triggers** : Push sur `main`, PR vers `main`
- **Jobs** : Lint, Test, Build, Docker, Deploy, Release
- **Environnements** : Production avec protection

### Workflow Development (dev)
- **Triggers** : Push sur `dev`, PR vers `dev`
- **Jobs** : Lint, Test, Build, Docker Build, Security Scan, Type Check
- **Artéfacts** : Sauvegarde des builds (7 jours)

### Protection des branches
- `main` : Protégée, nécessite review et CI réussi
- `dev` : Branch de développement principal

## 🔧 Technologies utilisées

### Frontend
- React 19 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Routing)
- ESLint (Linting)

### Backend
- Fastify (Web framework)
- TypeScript
- Sequelize (ORM)
- MySQL (Database)
- Swagger (API Documentation)
- Nodemon (Development)

### Outils
- PNPM (Package manager)
- ESLint (Code quality)
- Prettier (Code formatting)

## 📝 Fonctionnalités

### ✅ Implémentées
- [x] Configuration de base Frontend/Backend
- [x] Intégration TypeScript
- [x] Configuration Tailwind CSS
- [x] Routes de santé (Health checks)
- [x] Documentation Swagger
- [x] Composant de statut API
- [x] Service API avec gestion d'erreurs
- [x] Architecture maintenable et scalable
- [x] Tests unitaires (Vitest + Testing Library)
- [x] Linting et formatting (ESLint + Prettier)
- [x] CI/CD GitHub Actions
- [x] Workflows différenciés main/dev
- [x] Build et déploiement automatisés

### 🚧 À venir
- [ ] Authentification JWT
- [ ] CRUD utilisateurs
- [ ] Upload de fichiers avec Multer
- [ ] Déploiement Docker en production
- [ ] Tests d'intégration
- [ ] Monitoring et logs

## 🤝 Contribution

### Workflow de développement
1. Fork le projet
2. Créer une branche feature depuis `dev` (`git checkout -b feature/AmazingFeature`)
3. Développer et tester localement
4. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
5. Push vers la branche (`git push origin feature/AmazingFeature`)
6. Ouvrir une Pull Request vers `dev`
7. Après review et merge dans `dev`, créer une PR de `dev` vers `main` pour la production

### Standards de code
- Respecter les configurations ESLint et Prettier
- Écrire des tests unitaires pour les nouvelles fonctionnalités
- Utiliser des commits conventionnels (feat, fix, docs, etc.)
- Documenter les APIs avec Swagger

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
