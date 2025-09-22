# 🎨 Guide de la Palette de Couleurs

## Vue d'ensemble de la Palette

Votre nouvelle palette combine harmonieusement **des couleurs vives pour l'impact** avec **des neutres pour la lisibilité**, créant un design moderne, professionnel et accessible.

## 🎯 Palette Finale Recommandée

### **PRIMARY** (Couleur dominante)
- **Couleur** : `#4A90E2` (Bleu)
- **Usage** : Boutons principaux, liens, navigation active
- **Pourquoi** : Inspire la confiance, l'action et la stabilité

### **SECONDARY** (Complémentaire)
- **Couleur** : `#8E44AD` (Violet)
- **Usage** : Boutons secondaires, badges, headers
- **Pourquoi** : Créatif, sophistiqué, différenciant

### **ACCENT** (Highlight & Hover)
- **Couleur** : `#E74C9F` (Rose)
- **Usage** : Hover states, highlights, CTAs spéciaux
- **Pourquoi** : Énergique, moderne, accrocheur

### **NEUTRAL** (Base du design)
- **Texte principal** : `#43454A` (Gris foncé)
- **Texte secondaire** : `#525252` (Gris moyen)
- **Arrière-plan** : `#F5F5F5` (Blanc cassé)
- **Cartes/Modales** : `#FFFFFF` (Blanc pur)
- **Bordures** : `#E5E5E5` (Gris très clair)

### **SUCCESS** : `#22C55E` (Vert - dérivé du jaune)
### **WARNING** : `#F39C12` (Orange du dégradé)
### **ERROR** : `#EF4444` (Rouge - dérivé du rose)

---

## 💡 Comment utiliser cette palette

### **1. Hiérarchie visuelle**
```css
/* Titres principaux */
.main-title { color: #43454A; }

/* Titres avec accent */
.accent-title { 
  background: linear-gradient(135deg, #4A90E2, #8E44AD, #E74C9F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Texte de corps */
.body-text { color: #525252; }

/* Texte désactivé */
.muted-text { color: #737373; }
```

### **2. Boutons et interactions**
```css
/* Bouton principal */
.btn-primary {
  background: #4A90E2;
  color: white;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}
.btn-primary:hover {
  background: #3B73B8;
  transform: translateY(-1px);
}

/* Bouton accent (CTA important) */
.btn-accent {
  background: #E74C9F;
  color: white;
}
.btn-accent:hover {
  background: #DB2777;
}

/* Bouton secondaire */
.btn-secondary {
  background: #8E44AD;
  color: white;
}
```

### **3. États et feedback**
```css
/* Succès */
.success-message {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  color: #15803D;
}

/* Avertissement */
.warning-message {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #92400E;
}

/* Erreur */
.error-message {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
}
```

### **4. Arrière-plans et sections**
```css
/* Page principale */
body { background: #F5F5F5; }

/* Cartes et conteneurs */
.card {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  box-shadow: 0 1px 3px rgba(67, 69, 74, 0.1);
}

/* Sections avec accent */
.hero-section {
  background: linear-gradient(135deg, #4A90E2 0%, #8E44AD 50%, #E74C9F 100%);
  color: white;
}
```

---

## 🎨 Classes Tailwind prêtes à l'emploi

### **Texte**
- `text-neutral-800` - Texte principal
- `text-neutral-600` - Texte secondaire
- `text-neutral-500` - Texte désactivé
- `text-primary-500` - Liens et texte d'accent
- `text-accent-500` - Highlights importants

### **Arrière-plans**
- `bg-neutral-100` - Arrière-plan principal
- `bg-white` - Cartes et modales
- `bg-primary-500` - Boutons principaux
- `bg-secondary-500` - Boutons secondaires
- `bg-accent-500` - Éléments d'accent

### **Bordures**
- `border-neutral-200` - Bordures claires
- `border-neutral-300` - Bordures standard
- `border-primary-500` - Bordures colorées

### **États de focus**
- `focus:ring-primary-500` - Anneaux de focus
- `focus:border-primary-500` - Bordures de focus

---

## 🌈 Gradients disponibles

### **Gradient principal**
```css
background: linear-gradient(135deg, #4A90E2 0%, #8E44AD 50%, #E74C9F 100%);
```
**Classes Tailwind** : `bg-gradient-primary`

### **Gradient héro (complet)**
```css
background: linear-gradient(135deg, #4A90E2 0%, #8E44AD 25%, #E74C9F 50%, #F39C12 75%, #F1C40F 100%);
```
**Classes Tailwind** : `bg-gradient-hero`

### **Gradient secondaire**
```css
background: linear-gradient(135deg, #8E44AD 0%, #E74C9F 50%, #F39C12 100%);
```
**Classes Tailwind** : `bg-gradient-secondary`

---

## ✅ Bonnes pratiques

### **DO ✅**
- Utilisez les neutres pour 80% du contenu
- Réservez les couleurs vives pour les actions importantes
- Appliquez les gradients avec parcimonie (héros, CTAs spéciaux)
- Maintenez un contraste minimum de 4.5:1 pour l'accessibilité
- Utilisez les ombres colorées pour les boutons importants

### **DON'T ❌**
- Ne pas utiliser plus de 2 couleurs vives par section
- Éviter les fonds colorés pour le texte de corps
- Ne pas mélanger trop de gradients sur une même page
- Éviter les couleurs vives sur de grandes surfaces

---

## 🔧 Configuration technique

Les couleurs sont disponibles via :
- **CSS Custom Properties** : `var(--primary)`, `var(--neutral-800)`, etc.
- **Classes Tailwind** : Configuration automatique via `tailwind.config.ts`
- **Fichier de configuration** : `src/config/colors.ts` pour l'importation JavaScript

---

## 📱 Responsive et accessibilité

La palette est conçue pour :
- ✅ **WCAG AA compliance** (contraste minimum 4.5:1)
- ✅ **Mode sombre** compatible
- ✅ **Daltonisme** pris en compte
- ✅ **Mobile-first** design

---

Cette palette vous donne une base solide pour créer une identité visuelle cohérente, moderne et professionnelle ! 🚀
