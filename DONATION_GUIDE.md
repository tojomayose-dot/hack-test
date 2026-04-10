# 🩸 Système de Gestion des Dons de Sang

## 📋 Vue d'ensemble

Ce projet fournit une solution complète pour gérer les dons de sang avec :
- **Une API Node.js/Express** pour enregistrer les dons dans MongoDB
- **Un formulaire React ergonomique** pour saisir les informations des dons
- **Un script de test automatisé** pour valider l'API

---

## 🎯 Critères d'Ergonomie (Bastien & Scapin)

Le formulaire React respecte les 8 critères d'ergonomie de Bastien et Scapin :

### 1. **Guidage** ✓
- Labels clairs et explicites
- Textes d'aide sous chaque champ
- Messages de feedback contextuels
- En-tête informatif avec icône

### 2. **Charge de Travail** ✓
- Nombre minimal de champs (4-5)
- Sélection via liste déroulante plutôt que saisie libre
- Slider visuel pour la quantité
- Données pré-remplies (volume: 450 ml, santé: Normal)

### 3. **Contrôle Explicite** ✓
- Boutons clairement libellés ("Enregistrer", "Réinitialiser")
- Validation avant envoi
- Messages d'erreur détaillés
- Confirmation du succès avec ID du don

### 4. **Adaptabilité** ✓
- Interface responsive (mobile, tablet, desktop)
- Préférences de mouvement respectées (@media prefers-reduced-motion)
- Focus visible pour accessibilité clavier
- Zoom lisible (font-size: 14px min)

### 5. **Gestion des Erreurs** ✓
- Messages clairs (couleur rouge)
- Suggestions de correction
- Validations frontend ET backend
- Récupération gracieuse

### 6. **Homogénéité/Conformité** ✓
- Design cohérent dans toute l'interface
- Palette de couleurs uniforme
- Typographie consistante
- Icônes de Lucide-React

### 7. **Signifiance du Codage** ✓
- Icônes significatives (❤️ pour don, ✓ pour succès, ⚠️ pour erreur)
- Conventions de couleur (vert = succès, rouge = erreur, bleu = info)
- Champs obligatoires marqués avec *
- États visuels clairs (enabled/disabled/loading)

### 8. **Compatibilité** ✓
- Support des navigateurs modernes
- Accessibilité WCAG 2.1
- Pas de dépendances externes pesantes
- Compatible avec React 19+

---

## 🚀 Installation

### Backend

```bash
cd backend
npm install
# Vérifier que MongoDB est connecté dans .env
# MONGO_URI=mongodb://...
```

### Frontend

```bash
cd frontend
npm install
```

---

## 💻 Utilisation du Formulaire React

### 1. **Intégration dans l'application**

Ajoutez la route dans votre `App.jsx` :

```jsx
import DonationForm from './pages/DonationForm/DonationForm';

// Dans votre routeur:
<Route path="/donate" element={<DonationForm />} />
```

### 2. **Démarrer le serveur frontend**

```bash
cd frontend
npm run dev
```

Accédez à : `http://localhost:5173/donate`

### 3. **Flux utilisateur**

1. **Sélectionner un donneur** - Liste déroulante avec nom, groupe sanguin et téléphone
2. **Choisir un hôpital** - Liste déroulante avec nom et localisation
3. **Indiquer le volume** - Slider de 100 à 1000 ml (standard: 450 ml)
4. **Sélectionner l'état de santé** - (Normal, Fatigue, Tension Basse, Autre)
5. **Envoyer le formulaire** - Bouton "Enregistrer le Don"
6. **Affichage de la confirmation** - Message avec ID du don et disparition après 5s

---

## 🧪 Script de Test Node.js

### Utilisation

```bash
cd backend
node test-donations.js
```

### Scénarios testés

| # | Test | Description |
|---|------|-------------|
| 1 | Donation valide | POST avec données complètes et correctes |
| 2 | Volume minimum | 100 ml (limite basse) |
| 3 | Volume maximum | 1000 ml (limite haute) |
| 4 | Donneur invalide | ID inexistant → Erreur 400 |
| 5 | Hôpital invalide | ID inexistant → Erreur 400 |
| 6 | Champs manquants | hospitalId manquant → Erreur 400 |
| 7 | Historique | GET /api/donations/:donorId |

### Exemple de sortie

```
==============================================================
   TEST DE L'API POST /api/donations
==============================================================
URL: http://localhost:5000/api/donations
==============================================================

📋 Récupération des donneurs et hôpitaux...

  ✓ 3 donneur(s) trouvé(s)
  ✓ 2 hôpital(aux) trouvé(s)

🧪 TEST 1: Donation valide
✓ Créer une donation valide
  Status: 201
  ID du don créé: 507f1f77bcf86cd799439013
```

---

## 📊 Schéma de la Route API

### POST `/api/donations`

**Requête :**
```json
{
  "donorId": "507f1f77bcf86cd799439011",
  "hospitalId": "507f1f77bcf86cd799439012",
  "volume": 450,
  "healthNote": "Normal"
}
```

**Réponse (201 Created) :**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "donorId": "507f1f77bcf86cd799439011",
  "hospitalId": "507f1f77bcf86cd799439012",
  "volume": 450,
  "healthNote": "Normal",
  "donationDate": "2026-04-10T07:15:30.123Z",
  "status": "completed",
  "createdAt": "2026-04-10T07:15:30.123Z",
  "updatedAt": "2026-04-10T07:15:30.123Z"
}
```

### GET `/api/donations/:donorId`

Retourne l'historique des dons pour un donneur.

**Réponse (200 OK) :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "donorId": "507f1f77bcf86cd799439011",
    "hospitalId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Hôpital Central",
      "location": "Antananarivo"
    },
    "volume": 450,
    "healthNote": "Normal",
    "donationDate": "2026-04-10T07:15:30.123Z",
    "status": "completed"
  }
]
```

---

## 🎨 Personnalisation

### Modifier les couleurs

Dans `DonationForm.css`, changez le gradient :

```css
background: linear-gradient(135deg, #votre-couleur1 0%, #votre-couleur2 100%);
```

### Modifier les groupes sanguins

Dans `DonationForm.jsx`, dans le formulaire :

```jsx
<option value="O+">O+</option>
<option value="A+">A+</option>
// ... etc
```

### Ajouter des champs

```jsx
<div className="form-group">
  <label htmlFor="newField" className="form-label">
    Nouveau Champ <span className="required">*</span>
  </label>
  <input
    id="newField"
    name="newField"
    onChange={handleChange}
    className="form-input"
  />
</div>
```

---

## 🔍 Debugging

### Vérifier les logs du backend

```bash
# Terminal 1
cd backend
npm run dev
# Ou simplement
node server.js
```

### Vérifier les logs du frontend

Dans le navigateur, ouvrez la console (F12) pour voir :
- Les requêtes réseau
- Les réponses API
- Les erreurs JavaScript

### Tester l'API avec cURL

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "507f1f77bcf86cd799439011",
    "hospitalId": "507f1f77bcf86cd799439012",
    "volume": 450,
    "healthNote": "Normal"
  }'
```

---

## 📈 Fonctionnalités Futures

- [ ] Authentification de l'utilisateur
- [ ] Historique des dons avec graphiques
- [ ] Export en PDF
- [ ] Notifications email
- [ ] Rappels de don périodiques
- [ ] Statistiques de santé
- [ ] Synchronisation temps réel (WebSockets)

---

## 🤝 Support

Pour toute question ou problème :

1. Vérifiez que MongoDB est en cours d'exécution
2. Vérifiez que le backend écoute sur le port 5000
3. Vérifiez les logs du navigateur (F12)
4. Exécutez le script de test : `node test-donations.js`

---

## 📄 Licence

MIT - Libre d'utilisation à des fins commerciales et non commerciales.

---

**Créé pour respecter les critères d'ergonomie de Bastien & Scapin** ❤️
