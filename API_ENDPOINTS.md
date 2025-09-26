# 🔗 API Endpoints - Workflow Support

## Backend API Structure pour le Workflow 2iE

### 🏗️ Base URL : `http://localhost:5000/api`

---

## 📊 1. PROSPECTS API

### **GET** `/prospects`
- **Description** : Récupère tous les prospects de l'utilisateur connecté
- **Headers** : `Authorization: Bearer <token>`
- **Response** :
```json
{
  "success": true,
  "data": [
    {
      "id_prospect": 1,
      "nom_organisation": "École Polytechnique de Montréal",
      "secteur": "Enseignement Supérieur",
      "pays": "Canada",
      "contact": "Dr. Marie Tremblay",
      "email_contact": "m.tremblay@polymtl.ca",
      "statut": "qualifie",
      "potentiel_partenariat": "eleve",
      "utilisateur_id": 10,
      "date_creation": "2024-10-15T10:00:00Z"
    }
  ]
}
```

### **POST** `/prospects`
- **Description** : Crée un nouveau prospect
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "nom_organisation": "Université de Ouagadougou",
  "secteur": "Enseignement Supérieur",
  "pays": "Burkina Faso",
  "contact": "Prof. Karim Ouédraogo",
  "email_contact": "k.ouedraogo@uo.edu.bf",
  "telephone_contact": "+226-25-30-70-64",
  "potentiel_partenariat": "eleve",
  "notes": "Collaboration en génie civil"
}
```

### **PUT** `/prospects/:id`
- **Description** : Met à jour un prospect (changement de statut, qualification)
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "statut": "qualifie",
  "notes": "Prospect qualifié après entretien"
}
```

---

## 📝 2. PARTENARIATS API (Complet)

### **GET** `/partenariats`
- **Description** : Récupère tous les partenariats avec relations
- **Headers** : `Authorization: Bearer <token>`
- **Response** :
```json
{
  "success": true,
  "data": [
    {
      "id_partenariat": 1,
      "titre": "Partenariat Académique 2025-2027",
      "description": "Programme d'échange étudiants et enseignants",
      "type_partenariat": "academique",
      "statut": "actif",
      "date_debut": "2025-01-15",
      "date_fin": "2027-12-31",
      "objectifs": "Renforcer les échanges",
      "benefices_attendus": "Formation internationale",
      "partner": {
        "id_partenaire": 1,
        "nom_organisation": "Université de Ouagadougou",
        "pays": "Burkina Faso"
      },
      "conventions_count": 2
    }
  ]
}
```

### **POST** `/partenariats`
- **Description** : Crée un nouveau partenariat
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "titre": "Partenariat Innovation 2025",
  "description": "Collaboration recherche et développement",
  "type_partenariat": "recherche",
  "date_debut": "2025-03-01",
  "date_fin": "2026-02-28",
  "objectifs": "Développer des solutions innovantes",
  "benefices_attendus": "Transfert de technologie",
  "partenaire_id": 1,
  "responsable_2ie_id": 10
}
```

### **GET** `/partenariats/:id`
- **Description** : Récupère un partenariat spécifique avec toutes les relations
- **Headers** : `Authorization: Bearer <token>`

### **PUT** `/partenariats/:id`
- **Description** : Met à jour un partenariat existant
- **Headers** : `Authorization: Bearer <token>`

### **DELETE** `/partenariats/:id`
- **Description** : Supprime un partenariat
- **Headers** : `Authorization: Bearer <token>`

### **GET** `/partenariats/stats`
- **Description** : Statistiques des partenariats
- **Headers** : `Authorization: Bearer <token>`

---

## 🏢 3. PARTNERS API (Support)

### **POST** `/partners`
- **Description** : Crée un nouveau partenaire (utilisé dans le workflow)
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "nom_organisation": "Université de Ouagadougou",
  "type_organisation": "université",
  "secteur_activite": "Enseignement Supérieur",
  "pays": "Burkina Faso",
  "ville": "Ouagadougou",
  "email": "info@uo.edu.bf"
}
```

---

## 🔄 4. WORKFLOW SPECIFIC ENDPOINTS

### **POST** `/workflow/prospect-to-convention`
- **Description** : Convertit un prospect en convention (avec données pré-remplies)
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "prospect_id": 1,
  "titre": "Convention avec École Polytechnique de Montréal",
  "type_convention": "Convention académique",
  "objet": "Collaboration académique et recherche",
  "service_concerne": "Direction Académique"
}
```

### **POST** `/workflow/convention-signed`
- **Description** : Déclenche la création automatique partenaire + partenariat
- **Headers** : `Authorization: Bearer <token>`
- **Body** :
```json
{
  "convention_id": 1,
  "date_signature": "2025-01-15T10:00:00Z",
  "statut": "validee"
}
```

### **GET** `/workflow/stats`
- **Description** : Statistiques du workflow pour dashboard
- **Headers** : `Authorization: Bearer <token>`
- **Response** :
```json
{
  "success": true,
  "data": {
    "prospects": {
      "total": 127,
      "qualifies": 32,
      "nouveaux_ce_mois": 12
    },
    "conversions_ce_mois": {
      "prospect_vers_convention": 8,
      "convention_vers_partenaire": 6,
      "partenaire_vers_partenariat": 5
    },
    "taux_conversion": {
      "prospects_qualifies": 25,
      "conventions_signees": 49,
      "partenariats_actifs": 73
    }
  }
}
```

---

## 🔐 5. AUTHENTICATION

### **POST** `/auth/login`
- **Description** : Connexion utilisateur
- **Body** :
```json
{
  "email": "bakouan@gmail.com",
  "mot_de_passe": "password123"
}
```
- **Response** :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 10,
    "nom": "Bakouan",
    "prenom": "Zié",
    "email": "bakouan@gmail.com",
    "role": "responsable"
  }
}
```

---

## ⚙️ 6. CONFIGURATION DATABASE

### Structure des tables principales :

```sql
-- Prospects avec utilisateur
CREATE TABLE prospects (
    id_prospect SERIAL PRIMARY KEY,
    nom_organisation VARCHAR(255) NOT NULL,
    secteur VARCHAR(100),
    pays VARCHAR(100),
    contact VARCHAR(255),
    email_contact VARCHAR(255),
    telephone_contact VARCHAR(20),
    statut VARCHAR(50) DEFAULT 'nouveau',
    potentiel_partenariat VARCHAR(20) DEFAULT 'moyen',
    notes TEXT,
    utilisateur_id INTEGER REFERENCES utilisateurs(id_utilisateur),
    date_creation TIMESTAMP DEFAULT NOW(),
    derniere_mise_a_jour TIMESTAMP DEFAULT NOW()
);

-- Partenariats complets
CREATE TABLE partenariats (
    id_partenariat SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type_partenariat VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'actif',
    date_debut DATE,
    date_fin DATE,
    objectifs TEXT,
    benefices_attendus TEXT,
    partenaire_id INTEGER REFERENCES partenaires(id_partenaire),
    responsable_2ie_id INTEGER REFERENCES utilisateurs(id_utilisateur),
    date_creation TIMESTAMP DEFAULT NOW(),
    derniere_mise_a_jour TIMESTAMP DEFAULT NOW()
);

-- Partenaires
CREATE TABLE partenaires (
    id_partenaire SERIAL PRIMARY KEY,
    nom_organisation VARCHAR(255) NOT NULL,
    type_organisation VARCHAR(100),
    secteur_activite VARCHAR(100),
    pays VARCHAR(100),
    ville VARCHAR(100),
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255),
    site_web VARCHAR(255),
    description TEXT,
    statut VARCHAR(50) DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT NOW(),
    derniere_mise_a_jour TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 7. TESTS API

### Tests avec curl :

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bakouan@gmail.com","mot_de_passe":"password123"}'

# 2. Créer prospect
curl -X POST http://localhost:5000/api/prospects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"nom_organisation":"Test Org","secteur":"Tech","pays":"BF"}'

# 3. Récupérer partenariats
curl -X GET http://localhost:5000/api/partenariats \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Créer partenariat
curl -X POST http://localhost:5000/api/partenariats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"titre":"Test Partnership","type_partenariat":"test","partenaire_id":1}'
```

---

## 📊 8. STATUS CODES

- **200** : Succès
- **201** : Créé avec succès
- **400** : Erreur de validation
- **401** : Non autorisé (token manquant/invalide)
- **403** : Accès refusé
- **404** : Ressource non trouvée
- **500** : Erreur serveur

---

## 🚀 9. DÉMARRAGE

### Backend :
```bash
cd backend
npm install
node server.js
# Serveur sur http://localhost:5000
```

### Frontend :
```bash
cd frontend  
npm install
npm run dev
# Application sur http://localhost:3000
```

---

**📋 Toutes les APIs sont opérationnelles et supportent le workflow complet !** ✅
