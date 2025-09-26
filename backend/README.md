# Backend API - Gestion des Partenariats Institut 2iE

API REST pour la plateforme de gestion des partenariats de l'Institut 2iE.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
```
Modifier le fichier `.env` avec vos paramètres :
- `DB_PASSWORD` : Mot de passe MySQL
- `JWT_SECRET` : Clé secrète pour JWT (changez en production)

3. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📋 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| POST | `/api/auth/register` | Inscription utilisateur | Public |
| POST | `/api/auth/login` | Connexion utilisateur | Public |
| GET | `/api/auth/profile` | Profil utilisateur | Authentifié |
| PUT | `/api/auth/profile` | Mise à jour profil | Authentifié |
| POST | `/api/auth/verify` | Vérification token | Authentifié |
| POST | `/api/auth/logout` | Déconnexion | Authentifié |

### Autres endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Page d'accueil API |
| GET | `/api/health` | Santé de l'API |

## 📊 Modèles de données

### Utilisateur

```sql
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('lecteur', 'suivi', 'responsable', 'admin') DEFAULT 'lecteur',
  service VARCHAR(255),
  statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  derniere_connexion TIMESTAMP NULL
);
```

### Rôles utilisateur

- **lecteur** : Consultation uniquement
- **suivi** : Gestion des projets
- **responsable** : Gestion complète 
- **admin** : Administration système

## 🔒 Sécurité

- **JWT** : Authentification basée sur tokens
- **Bcrypt** : Hachage des mots de passe (12 rounds)
- **Rate Limiting** : Protection contre les attaques par déni de service
- **CORS** : Configuration pour le frontend
- **Helmet** : Headers de sécurité
- **Validation** : Validation des données avec express-validator

## 📝 Format des réponses

### Succès
```json
{
  "success": true,
  "message": "Message de succès",
  "data": {
    // Données de réponse
  }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [
    // Détails des erreurs de validation
  ]
}
```

## 🛠️ Structure du projet

```
backend/
├── config/
│   └── database.js          # Configuration base de données
├── controllers/
│   └── authController.js    # Contrôleurs d'authentification
├── middleware/
│   └── auth.js             # Middleware d'authentification
├── models/
│   └── User.js             # Modèle utilisateur
├── routes/
│   └── auth.js             # Routes d'authentification
├── validators/
│   └── authValidators.js   # Validations
├── .env                    # Variables d'environnement
├── .env.example           # Exemple de configuration
├── package.json           # Dépendances
└── server.js             # Serveur principal
```

## 🧪 Test de l'API

### Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Doe",
    "prenom": "John", 
    "email": "john@example.com",
    "password": "MotDePasse123!",
    "role": "lecteur",
    "service": "Direction Générale"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MotDePasse123!"
  }'
```

### Profil (avec token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement | development |
| `PORT` | Port du serveur | 5000 |
| `DB_HOST` | Host MySQL | localhost |
| `DB_USER` | Utilisateur MySQL | root |
| `DB_PASSWORD` | Mot de passe MySQL | |
| `DB_NAME` | Nom base de données | partners_2ie |
| `DB_PORT` | Port MySQL | 3306 |
| `JWT_SECRET` | Clé secrète JWT | |
| `JWT_EXPIRE` | Expiration token | 30d |
| `FRONTEND_URL` | URL du frontend | http://localhost:3001 |

## 🚨 Production

Pour déployer en production :

1. **Variables d'environnement**
   - Changez `JWT_SECRET` par une clé forte
   - Configurez la base de données de production
   - Définissez `NODE_ENV=production`

2. **Base de données**
   - Créez la base de données de production
   - Les tables seront créées automatiquement

3. **SSL/HTTPS**
   - Configurez un reverse proxy (nginx, Apache)
   - Utilisez des certificats SSL

## 📞 Support

Pour toute question ou problème :
- Email : support@2ie.edu
- Documentation : [Lien vers la documentation]

## 📄 Licence

MIT License - Institut 2iE
