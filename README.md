# Thales Project

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

### Backend
- `pnpm dev` - Serveur de développement avec auto-reload
- `pnpm build` - Compilation TypeScript
- `pnpm start` - Démarrage en production

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

### 🚧 À venir
- [ ] Authentification JWT
- [ ] CRUD utilisateurs
- [ ] Upload de fichiers avec Multer
- [ ] Tests unitaires
- [ ] Déploiement Docker
- [ ] CI/CD

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
