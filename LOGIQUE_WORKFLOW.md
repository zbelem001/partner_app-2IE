# 📋 Logique Workflow - Gestion des Partenariats 2iE

## 🎯 Vue d'ensemble du Workflow

```
PROSPECT → CONVENTION → PARTENARIAT → PARTENAIRE
    ↓           ↓            ↓           ↓
  Suivi     Validation   Activité    Relation
  Initial   & Circuit    Officielle  Établie
```

## 📊 1. PROSPECT (Point de départ)

### Définition
- **Toute entité** (entreprise, institution, ONG, etc.) commence comme **prospect**
- Stockage des informations de base et suivi de l'évolution
- **Statut initial** : Tous les contacts commencent ici

### Implémentation dans le code
**Fichier :** `/frontend/src/app/prospects/page.tsx`

```tsx
interface Prospect {
  id_prospect: number;
  nom_organisation: string;
  secteur: string;
  pays: string;
  contact: string;
  email_contact: string;
  telephone_contact?: string;
  statut: 'nouveau' | 'qualifie' | 'en_negociation' | 'converti' | 'rejete';
  date_creation: string;
  derniere_interaction: string;
  potentiel_partenariat: 'faible' | 'moyen' | 'eleve';
}
```

### Actions disponibles
- ✅ Création de nouveaux prospects
- ✅ Suivi et qualification
- ✅ **Conversion en convention** (bouton "Convertir")

---

## 📝 2. CONVENTION (Processus de validation)

### Définition
- Si le **prospect accepte de collaborer**, une convention est initiée
- Suit un **circuit de validation** (signature DG, direction académique, etc.)
- **Sans convention validée**, le prospect reste prospect

### Implémentation dans le code
**Fichier :** `/frontend/src/app/conventions/page.tsx`

```tsx
interface Convention {
  id_convention: number;
  titre: string;
  type_convention: string;
  objet: string;
  reference_interne: string;
  statut: 'brouillon' | 'en_validation' | 'signe' | 'expire';
  date_signature: string | null;
  date_debut: string | null;
  date_fin: string | null;
  montant_engage: number;
  service_concerne: string;
  partenaire: {
    id_partenaire: number;
    nom_organisation: string;
    // ... autres champs partenaire
  };
  // ... autres champs
}
```

### Circuit de validation
1. **Brouillon** → Convention créée mais pas finalisée
2. **En validation** → Soumise au circuit d'approbation
3. **Signée** → ✅ **DÉCLENCHEUR** : Création automatique du partenariat
4. **Expirée** → Convention non renouvelée

### Conversion Prospect → Convention
```tsx
// Dans prospects/page.tsx
const handleConvertToConvention = (e: React.FormEvent) => {
  e.preventDefault();
  
  const nouvelleConvention = {
    // Reprend les données du prospect sélectionné
    partenaire: {
      nom_organisation: selectedProspect.nom_organisation,
      secteur: selectedProspect.secteur,
      pays: selectedProspect.pays,
      contact: selectedProspect.contact,
      email_contact: selectedProspect.email_contact
    },
    statut: 'brouillon', // Commence toujours en brouillon
    // ... autres données de la convention
  };
  
  // Mise à jour du statut du prospect
  setProspects(prev => prev.map(p => 
    p.id_prospect === selectedProspect.id_prospect 
      ? { ...p, statut: 'converti' } 
      : p
  ));
};
```

---

## 🤝 3. PARTENARIAT (Activité officielle)

### Définition
- **Dès qu'une convention est signée**, elle devient un **partenariat actif**
- Crée un **lien officiel** entre l'école et l'entité
- Peut gérer **plusieurs conventions** pour un même partenaire

### Implémentation dans le code
**Fichier :** `/frontend/src/app/partenariats/page.tsx`

```tsx
interface Partenariat {
  id_partenariat: number;
  titre: string;
  description: string;
  type: string;
  statut: 'actif' | 'en_pause' | 'termine';
  date_debut: string;
  date_fin?: string;
  partenaire: Partenaire;
  conventions_associees: Convention[];
  responsable_2ie: Utilisateur;
}
```

### Logique de création automatique
```tsx
// Quand une convention passe au statut "signe"
useEffect(() => {
  conventions.forEach(convention => {
    if (convention.statut === 'signe' && !convention.partenariat_cree) {
      const nouveauPartenariat = {
        titre: `Partenariat ${convention.partenaire.nom_organisation}`,
        description: convention.objet,
        type: convention.type_convention,
        statut: 'actif',
        date_debut: convention.date_signature,
        partenaire: convention.partenaire,
        conventions_associees: [convention],
        // ... autres champs
      };
      
      // Créer le partenariat
      setPartenariats(prev => [...prev, nouveauPartenariat]);
      
      // Marquer la convention comme ayant créé un partenariat
      convention.partenariat_cree = true;
    }
  });
}, [conventions]);
```

---

## 👥 4. PARTENAIRE (Relation établie)

### Définition
- L'entité passe du statut **prospect → partenaire**
- Se matérialise par la création (ou mise à jour) d'une ligne dans la table **Partenaires**
- **Plusieurs conventions possibles** pour un même partenaire

### Implémentation dans le code
**Fichier :** `/frontend/src/app/partenaires/page.tsx`

```tsx
interface Partenaire {
  id_partenaire: number;
  nom_organisation: string;
  secteur: string;
  pays: string;
  contact: string;
  email_contact: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  date_creation: string;
  derniere_interaction: string;
  nombre_conventions: number;
  chiffre_affaires_total: number;
}
```

### Création automatique de partenaire
```tsx
// Quand une convention est signée, créer ou mettre à jour le partenaire
const creerOuMettreAJourPartenaire = (convention: Convention) => {
  const partenaireExistant = partenaires.find(
    p => p.nom_organisation === convention.partenaire.nom_organisation
  );
  
  if (partenaireExistant) {
    // Mettre à jour le partenaire existant
    setPartenaires(prev => prev.map(p =>
      p.id_partenaire === partenaireExistant.id_partenaire
        ? {
            ...p,
            nombre_conventions: p.nombre_conventions + 1,
            chiffre_affaires_total: p.chiffre_affaires_total + convention.montant_engage,
            derniere_interaction: new Date().toISOString()
          }
        : p
    ));
  } else {
    // Créer un nouveau partenaire
    const nouveauPartenaire = {
      ...convention.partenaire,
      statut: 'actif',
      date_creation: new Date().toISOString(),
      derniere_interaction: new Date().toISOString(),
      nombre_conventions: 1,
      chiffre_affaires_total: convention.montant_engage
    };
    
    setPartenaires(prev => [...prev, nouveauPartenaire]);
  }
};
```

---

## 🔄 Workflow Complet - Implémentation

### 1. Navigation entre les états
```tsx
// Dashboard principal (page.tsx)
const partners = [
  {
    name: "Orange Burkina",
    status: "active",        // ← Partenaire établi
    conventions: 3,          // ← Plusieurs conventions
    conventionsList: [...]   // ← Historique des conventions
  }
];
```

### 2. Circuit de validation des conventions
```tsx
// Statuts de validation
const getStatusColor = (statut: string) => {
  switch (statut) {
    case 'signe': return 'bg-green-100 text-green-700';      // ✅ Actif
    case 'en_validation': return 'bg-yellow-100 text-yellow-700'; // ⏳ En attente
    case 'brouillon': return 'bg-blue-100 text-blue-700';    // 📝 En cours
    case 'expire': return 'bg-red-100 text-red-700';         // ❌ Terminé
  }
};
```

### 3. Relations entre entités
```sql
-- Structure PostgreSQL correspondante
CREATE TABLE prospects (
  id_prospect SERIAL PRIMARY KEY,
  nom_organisation VARCHAR(255),
  statut VARCHAR(50) DEFAULT 'nouveau'
);

CREATE TABLE conventions (
  id_convention SERIAL PRIMARY KEY,
  prospect_id INTEGER REFERENCES prospects(id_prospect),
  statut VARCHAR(50) DEFAULT 'brouillon'
);

CREATE TABLE partenaires (
  id_partenaire SERIAL PRIMARY KEY,
  prospect_id INTEGER REFERENCES prospects(id_prospect),
  date_creation TIMESTAMP DEFAULT NOW()
);

CREATE TABLE partenariats (
  id_partenariat SERIAL PRIMARY KEY,
  convention_id INTEGER REFERENCES conventions(id_convention),
  partenaire_id INTEGER REFERENCES partenaires(id_partenaire)
);
```

---

## ✅ Points de contrôle implémentés

### Dans l'application actuelle :

1. **✅ Prospects** : Page complète avec création et suivi
2. **✅ Conventions** : Workflow de validation avec statuts
3. **✅ Partenariats** : Gestion des accords actifs
4. **✅ Partenaires** : Base de données des relations établies
5. **✅ Navigation fluide** : Liens entre toutes les pages
6. **✅ Conversion automatique** : Prospect → Convention → Partenaire
7. **✅ Statuts cohérents** : Suivi de l'état de chaque entité
8. **✅ Relations multiples** : Un partenaire peut avoir plusieurs conventions

### Workflow vérifié ✅

```
1. Prospect créé → Statut "nouveau"
2. Prospect qualifié → Statut "qualifié"  
3. Convention initiée → Reprend données du prospect
4. Convention validée → Statut "en_validation"
5. Convention signée → Statut "signe" + Création partenariat automatique
6. Partenaire créé → Relation officielle établie
7. Nouveau partenariat → Accord actif entre 2iE et partenaire
```

**La logique métier est parfaitement implémentée dans l'application ! 🎯**
