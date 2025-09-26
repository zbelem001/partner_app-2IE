# 🔄 Circuit de Validation des Conventions - 2iE

## 📋 Vue d'ensemble du système

Le système de circuit de validation permet un processus de validation séquentiel et traçable pour chaque convention, respectant la hiérarchie et les procédures de 2iE.

## 🏗️ Architecture du Circuit

### 1. Étapes de validation standardisées

```typescript
const etapesValidationStandard = [
  {
    ordre: 1,
    nom_etape: "Direction concernée",
    description: "Validation par la direction du service concerné",
    service_responsable: "Direction concernée"
  },
  {
    ordre: 2, 
    nom_etape: "SRECIP",
    description: "Service Relations Extérieures & Coopération Internationale Partenariats",
    service_responsable: "SRECIP"
  },
  {
    ordre: 3,
    nom_etape: "DFC", 
    description: "Direction Financière & Comptable",
    service_responsable: "DFC"
  },
  {
    ordre: 4,
    nom_etape: "CAQ",
    description: "Contrôle Assurance Qualité", 
    service_responsable: "CAQ"
  },
  {
    ordre: 5,
    nom_etape: "DG",
    description: "Directeur Général",
    service_responsable: "Direction Générale"
  },
  {
    ordre: 6,
    nom_etape: "Transmission partenaire",
    description: "Transmission au partenaire pour signature",
    service_responsable: "SRECIP"
  },
  {
    ordre: 7,
    nom_etape: "Archivage",
    description: "Archivage de la convention signée",
    service_responsable: "Archives"
  }
];
```

### 2. Statuts des conventions

#### 🔵 **Brouillon**
- Convention créée mais circuit non démarré
- Aucune validation initiée
- Modifications possibles

#### 🟡 **En signature** 
- Circuit de validation en cours
- Validation séquentielle active
- Étapes suivies dans l'ordre

#### 🟢 **Validée**
- Toutes les étapes validées avec succès
- Convention prête pour exécution
- Processus complet terminé

#### 🔴 **Rejetée**
- Une étape a été rejetée
- Circuit arrêté
- Nécessite révision

#### ⚫ **Expirée**
- Convention arrivée à échéance
- Plus valide pour nouveaux accords

## 📊 Implémentation technique

### Interface `ValidationConvention`

```typescript
interface ValidationConvention {
  id_validation: number;
  convention_id: number;
  etape: EtapeValidation;
  statut: 'en_attente' | 'validee' | 'rejetee';
  date_validation: string | null;
  valideur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    service: string;
  } | null;
  commentaire: string | null;
}
```

### Propriétés ajoutées aux conventions

```typescript
interface ConventionWithRelations {
  // ... propriétés existantes
  validations: ValidationConvention[];
  etape_courante: number; // Numéro de l'étape en cours
  progression_validation: number; // Pourcentage (0-100)
}
```

## 🎯 Workflow du circuit

### 1. Initialisation
```
Convention créée → Statut: "brouillon"
↓
Lancement du circuit → Statut: "en_signature" 
↓
Création automatique des lignes de validation (statut: "en_attente")
```

### 2. Validation séquentielle
```
Étape N validée → Déblocage étape N+1
Étape N rejetée → Arrêt du circuit + Convention "rejetée"
```

### 3. Finalisation
```
Toutes étapes validées → Convention "validée"
Circuit terminé → Archivage automatique
```

## 🖥️ Interface utilisateur

### 1. **Tableau de bord des conventions**
- Statistiques par statut (Validées, En signature, Brouillons, Rejetées)
- Filtrage par statut
- Codes couleur pour identification rapide

### 2. **Détails d'une convention**
- **Circuit de validation visuel** avec icônes de statut :
  - ✅ Étape validée (vert)
  - ❌ Étape rejetée (rouge) 
  - 🕐 Étape en attente (bleu)
  - ⚪ Étape non atteinte (gris)

### 3. **Actions disponibles**
- **Lancer le circuit** (pour brouillons)
- **Valider une étape** (étape courante)
- **Rejeter une étape** (avec commentaire obligatoire)

### 4. **Traçabilité complète**
- Date et heure de chaque action
- Identité du valideur
- Commentaires de validation/rejet
- Historique complet des étapes

## 📋 Règles métier implémentées

### ✅ **Validation séquentielle stricte**
- Une étape ne peut être validée que si la précédente l'a été
- Impossible de "sauter" des étapes

### ✅ **Arrêt en cas de rejet**
- Dès qu'une étape est rejetée, le circuit s'arrête
- La convention passe au statut "rejetée"
- Nécessite une nouvelle version pour relancer

### ✅ **Traçabilité obligatoire**
- Chaque action est datée et identifiée
- Commentaire obligatoire pour les rejets
- Historique complet conservé

### ✅ **Progression visuelle**
- Barre de progression en pourcentage
- Étape courante mise en évidence
- Statuts visuels pour chaque étape

## 🔧 Fonctions utilitaires

### `lancerCircuitValidation(conventionId)`
- Change le statut de "brouillon" à "en_signature"
- Initialise toutes les lignes de validation

### `calculerProgressionValidation(validations)`
- Calcule le pourcentage d'étapes validées
- Mise à jour en temps réel

### `obtenirEtapeCourante(validations)`
- Identifie la prochaine étape à valider
- Gestion de la séquentialité

### `validerEtape(conventionId, etapeOrdre, commentaire)`
- Valide une étape spécifique
- Met à jour la progression
- Passe à l'étape suivante

### `rejeterEtape(conventionId, etapeOrdre, commentaire)`
- Rejette une étape avec commentaire obligatoire
- Arrête le circuit
- Change le statut à "rejetée"

## 📈 Avantages du système

### 🎯 **Conformité procédurale**
- Respect de la hiérarchie 2iE
- Validation par les bonnes instances
- Traçabilité réglementaire

### 📊 **Visibilité managériale**
- Suivi temps réel des validations
- Identification des blocages
- Tableaux de bord statistiques

### 🔒 **Sécurité et contrôle**
- Impossibilité de contourner des étapes
- Validation obligatoire par autorisés
- Historique inaltérable

### ⚡ **Efficacité opérationnelle**
- Automatisation du workflow
- Notifications automatiques (à implémenter)
- Réduction des délais de traitement

## 🚀 Évolutions possibles

### 📧 **Notifications automatiques**
- Email aux valideurs quand étape à leur niveau
- Relances automatiques après délai
- Notifications de validation/rejet

### 📅 **Délais et SLA**
- Définition de délais par étape
- Alerte en cas de retard
- Escalation automatique

### 📊 **Analytics avancés**
- Temps moyen par étape
- Taux de rejet par service
- Performance du circuit

### 🔄 **Workflows personnalisés**
- Circuits différents selon le type de convention
- Étapes conditionnelles
- Validation parallèle pour certaines étapes

---

## ✅ **Système opérationnel !**

Le circuit de validation est maintenant **parfaitement intégré** dans l'application de gestion des partenariats 2iE, offrant un processus **professionnel, traçable et conforme** aux exigences institutionnelles.

**Navigation :** `http://localhost:3001/conventions` → Cliquer sur "Voir détails" d'une convention pour accéder au circuit de validation complet ! 🎯
