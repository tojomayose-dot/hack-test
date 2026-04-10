# AnimatedBackground - Composant de Fond Animé Universel

## 📋 Vue d'Ensemble

`AnimatedBackground` est un composant React réutilisable qui crée un arrière-plan animé subtil et professionnel avec dégradés de mailles (Mesh Gradient). Il utilise des sphères lumineuses flottantes pour une animation fluide et imperceptible.

## ✨ Caractéristiques

- ✅ **Léger en Performance** : Utilise du CSS pur, sans images ou vidéos
- ✅ **Animation Fluide** : Mouvements doux et naturels avec `mix-blend-mode: screen`
- ✅ **3 Thèmes Dynamiques** : Bleu, Rouge et Sombre (Dark)
- ✅ **Responsive** : Adapté aux mobiles, tablettes et ordinateurs
- ✅ **Backdrop Blur Compatible** : Fonctionne avec les filtres flous modernes
- ✅ **Positionnement Fixed** : Reste derrière le contenu sans interférence

---

## 🚀 Installation & Utilisation

### 1. Importer le Composant

```jsx
import AnimatedBackground from '../../components/AnimatedBackground';
```

### 2. Utiliser dans Votre Formulaire

```jsx
return (
  <div className="donation-form-container">
    {/* Ajouter le composant AnimatedBackground */}
    <AnimatedBackground themeColor="red" />
    
    {/* Votre formulaire */}
    <form className="donation-form">
      {/* Contenu */}
    </form>
  </div>
);
```

### 3. Configurer le CSS du Conteneur

```css
.donation-form-container {
  min-height: 100vh;
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.donation-form {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## 🎨 Props Disponibles

| Prop | Type | Valeurs | Défaut | Description |
|------|------|---------|--------|-------------|
| `themeColor` | string | `'blue'`, `'red'`, `'dark'` | `'dark'` | Thème de couleur du fond animé |

---

## 🎭 Thèmes Disponibles

### 🔵 Thème Bleu
```jsx
<AnimatedBackground themeColor="blue" />
```
- **Fond** : Dégradé de bleus profonds (#0000FF → #1D4ED8)
- **Lumières** : Bleu clair (#ADD8E6) et Bleu ciel (#87CEEB)
- **Cas d'Usage** : Formulaires de connexion, pages d'accueil

### 🔴 Thème Rouge
```jsx
<AnimatedBackground themeColor="red" />
```
- **Fond** : Dégradé de rouges (#B91C1C → #DC2626)
- **Lumières** : Rose pâle (#FFB6C1) et Orange doux (#FFB347)
- **Cas d'Usage** : Enregistrement des dons, formulaires d'action

### ⬛ Thème Sombre
```jsx
<AnimatedBackground themeColor="dark" />
```
- **Fond** : Noir ardoise (#0f172a) avec gris bleu
- **Lumières** : Gris blui subtil (#64748b, #475569)
- **Cas d'Usage** : Panels admin, pages confidentielles

---

## 📱 Responsive Design

Le composant s'adapte automatiquement à la taille de l'écran :

| Breakpoint | Ajustements |
|-----------|------------|
| **Desktop** (> 768px) | Sphères grandes, animation normale (15s) |
| **Tablette** (768px) | Sphères réduites, animation plus lente (20s) |
| **Mobile** (< 480px) | Très subtiles, animation ralentie (25s), opacité réduite |

---

## 🔄 Détails d'Animation

### Mouvement des Sphères

**Sphère 1** (`.animated-orb-1`) :
- Taille : 400px → 300px → 250px (responsive)
- Animation : Mouvement circulaire lent
- Durée : 15s → 20s → 25s (responsive)

**Sphère 2** (`.animated-orb-2`) :
- Taille : 300px → 250px → 200px (responsive)
- Animation : Mouvement inverse, décalé
- Durée : 15s → 20s → 25s (responsive)

### Propriétés d'Effet

```css
mix-blend-mode: screen;      /* Ajoute les couleurs à l'arrière-plan */
filter: blur(80px);          /* Flou pour une apparence douce */
opacity: 0.4 → 0.6;          /* Variation subtile */
```

---

## 💡 Conseils d'Optimisation

### Performance
- ✅ Le composant utilise seulement CSS keyframes (pas de JavaScript)
- ✅ Aucune image ou vidéo téléchargée
- ✅ Activation de `will-change` pour le GPU (si nécessaire)

### Accessibilité
- ✅ Le fond n'interfère pas avec la lecture car il reste en arrière-plan (z-index: -1)
- ✅ Use `prefers-reduced-motion` pour les utilisateurs sensibles

### Compatibilité Navigateur
- ✅ Chrome, Firefox, Safari (moderne)
- ⚠️ IE11 : Non supporté (manque backdrop-filter)
- ✅ Mobile : Fonctionne sur iOS et Android récents

---

## 🔧 Personnalisation Avancée

### Modifier les Couleurs d'un Thème

Vous pouvez étendre le composant ou le modifier directement dans `AnimatedBackground.jsx` :

```jsx
const getThemeStyles = () => {
  const themes = {
    custom: {
      bg: 'linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%)',
      light1: '#lightColor1',
      light2: '#lightColor2',
      name: 'custom'
    }
  };
  return themes[themeColor] || themes.dark;
};
```

### Ajuster la Vitesse d'Animation

Modifiez `animation-duration` dans `AnimatedBackground.css` :

```css
.animated-orb {
  animation-duration: 20s; /* Changer 15s par votre valeur */
}
```

### Changer le Flou

Modifiez `filter: blur()` :

```css
.animated-orb {
  filter: blur(100px); /* Augmentez pour plus de flou, réduisez pour plus de détails */
}
```

---

## 📚 Exemples Complets

### Exemple 1 : Formulaire de Donation
```jsx
import AnimatedBackground from '../../components/AnimatedBackground';

const DonationForm = () => {
  return (
    <div className="donation-form-container">
      <AnimatedBackground themeColor="red" />
      
      <div className="form-header">
        <h1>Enregistrer un Don</h1>
      </div>
      
      <form className="donation-form">
        {/* Formulaire */}
      </form>
    </div>
  );
};
```

### Exemple 2 : Page de Connexion Admin
```jsx
const AdminLogin = () => {
  return (
    <div className="login-container">
      <AnimatedBackground themeColor="dark" />
      
      <div className="login-card">
        <h1>Espace Administrateur</h1>
        {/* Formulaire de connexion */}
      </div>
    </div>
  );
};
```

### Exemple 3 : Inscription Donateur
```jsx
const DonorRegister = () => {
  return (
    <div className="register-container">
      <AnimatedBackground themeColor="blue" />
      
      <form className="register-form">
        <h1>Créer un Compte Donateur</h1>
        {/* Formulaire d'inscription */}
      </form>
    </div>
  );
};
```

---

## 🐛 Dépannage

### Le fond n'apparaît pas
- Vérifiez que le conteneur parent a `position: relative;`
- Assurez-vous que `z-index: -1;` est correct

### L'animation est saccadée
- Vérifiez votre FPS sur le navigateur
- Réduisez l'opacité ou le blur sur mobile (`will-change`)

### Les couleurs ne correspondent pas
- Vérifiez le thème passé en prop
- Assurez-vous que le CSS est importé correctement

---

## 📝 Licence & Crédits

Composant développé pour optimiser les interfaces des formulaires avec une animation fluide et légère.

---

## 📞 Support

Pour toute question ou adaptation spécifique, consultez le fichier `AnimatedBackground.example.jsx`.
