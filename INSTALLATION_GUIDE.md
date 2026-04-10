# 📋 Installation du Formulaire DonationForm

## 🎯 Objectif

Intégrer le composant React `DonationForm` dans votre application existante.

---

## ✅ Fichiers créés

Trois fichiers ont été créés pour vous :

1. **Frontend:**
   - `/frontend/src/pages/DonationForm/DonationForm.jsx` - Composant React
   - `/frontend/src/pages/DonationForm/DonationForm.css` - Styles

2. **Backend:**
   - `/backend/test-donations.js` - Script de test Node.js
   - `/backend/test-donations.sh` - Script de test Bash
   - `/backend/seed-data.js` - Données de test
   - `/backend/postman-collection.json` - Collection Postman

3. **Documentation:**
   - `/DONATION_GUIDE.md` - Guide complet
   - `/TESTING_GUIDE.md` - Guide de test

---

## 🚀 Étapes d'installation

### Étape 1: Vérifier les dépendances

```bash
# Frontend - Vérifier que lucide-react et axios sont installés
cd frontend
npm list lucide-react axios

# Résultat attendu:
# lucide-react@1.8.0
# axios@1.15.0
```

### Étape 2: Ajouter la route dans App.jsx

Ouvrez `/frontend/src/App.jsx` et mettez à jour les imports:

```jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './services/api';
import Register from './pages/RegisterPage/Register';
import AdminLogin from './pages/LoginPage/AdminLogin';
import Dashboard from './pages/dashboardPage/Dashboard';
import DonorLogin from './pages/DonorLoginPage/DonorLogin';
import DonorSpace from './pages/DonorSpace/DonorSpace';
import DonationForm from './pages/DonationForm/DonationForm';  // ← AJOUTER CETTE LIGNE

function App() {
  const [status, setStatus] = useState({ loading: true, connected: false });

  useEffect(() => {
    api.get('/stats')
      .then(() => setStatus({ loading: false, connected: true }))
      .catch(() => setStatus({ loading: false, connected: false }));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-donneur" element={<DonorLogin />} />
        <Route path="/donor-space" element={<DonorSpace />} />
        <Route path="/donate" element={<DonationForm />} />  {/* ← AJOUTER CETTE ROUTE */}
        <Route path="/login" element={<div className="p-10 text-center font-bold">Page Login (H+20)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Étape 3: Démarrer le serveur frontend

```bash
cd frontend
npm run dev
```

Accédez à: `http://localhost:5173/donate`

---

## 🧪 Test du Formulaire

### Avant de tester, créer des données

```bash
cd backend
node seed-data.js
```

Cela crée:
- 4 donneurs
- 3 hôpitaux
- 4 exemples de dons

### Tester le formulaire

1. Ouvrir `http://localhost:5173/donate`
2. Sélectionner un donneur
3. Sélectionner un hôpital
4. Ajuster le volume (450 ml par défaut)
5. Cliquer sur "Enregistrer le Don"
6. Vérifier le message de confirmation ✅

---

## 🎨 Personnalisation

### Changer la couleur du thème

Ouvrez `DonationForm.css` et modifiez:

```css
/* Ligne 10 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Changez par vos couleurs:
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
*/
```

### Ajouter des champs au formulaire

Dans `DonationForm.jsx`, ajoutez dans l'état:

```jsx
const [formData, setFormData] = useState({
  donorId: '',
  hospitalId: '',
  volume: 450,
  healthNote: 'Normal',
  myNewField: ''  // ← NOUVEAU CHAMP
});
```

Puis ajoutez le HTML:

```jsx
<div className="form-group">
  <label htmlFor="myNewField" className="form-label">
    Mon Nouveau Champ
  </label>
  <input
    id="myNewField"
    name="myNewField"
    value={formData.myNewField}
    onChange={handleChange}
    className="form-input"
  />
</div>
```

### Modifier les états de santé

Dans `DonationForm.jsx`, ligne ~145:

```jsx
<option value="Normal">Normal</option>
<option value="Fatigue">Fatigue</option>
<option value="Tension Basse">Tension Basse</option>
<option value="Autre">Autre</option>
{/* Ajoutez ici */}
<option value="Mon État">Mon État</option>
```

---

## 🐛 Troubleshooting

### Le formulaire affiche "Chargement des données..."

**Vérifiez:**
- Le backend est-il démarré? (`node server.js`)
- L'endpoint `/api/donors` répond-il?
- Y a-t-il des donneurs dans la base?

```bash
# Tester l'endpoint
curl http://localhost:5000/api/donors
```

### Les listes déroulantes sont vides

**Solution:**
```bash
# Insérer les données de test
cd backend
node seed-data.js
```

### Erreur "Failed to fetch"

**Vérifiez:**
- CORS est activé dans le backend (package.json require('cors'))
- L'URL API est correcte dans `frontend/src/services/api.js`

### Le formulaire se réinitialise après envoi

C'est normal! Le formulaire réinitialise les données et affiche un message de succès.

---

## 📱 Responsive Design

Le formulaire est automatiquement responsive:

- **Desktop:** 600px max-width, layout fluide
- **Tablet:** Padding réduit, fullwidth
- **Mobile:** Stack vertical, boutons fullwidth

Testez avec F12 (DevTools) → Toggle device toolbar

---

## ♿ Accessibilité

Le formulaire respecte WCAG 2.1:

- ✅ Labels associés aux inputs
- ✅ Contraste de couleur suffisant
- ✅ Focus visible pour clavier
- ✅ Textes d'aide lisibles
- ✅ Messages d'erreur clairs

**Tester avec:**
```bash
# Extension Chrome: Lighthouse
# Audit → Accessibility
```

---

## 📊 API Endpoint Utilisé

### POST `/api/donations`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "donorId": "507f1f77bcf86cd799439001",
  "hospitalId": "507f1f77bcf86cd799439011",
  "volume": 450,
  "healthNote": "Normal"
}
```

**Réponse (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439999",
  "donorId": "507f1f77bcf86cd799439001",
  "hospitalId": "507f1f77bcf86cd799439011",
  "volume": 450,
  "healthNote": "Normal",
  "status": "completed",
  "createdAt": "2026-04-10T..."
}
```

---

## 🔗 Fichiers Importants

- [DonationForm.jsx](./frontend/src/pages/DonationForm/DonationForm.jsx)
- [DonationForm.css](./frontend/src/pages/DonationForm/DonationForm.css)
- [Donation Model](./backend/models/Donation.js)
- [Donation Routes](./backend/routes/donationRoutes.js)

---

## ✨ Fonctionnalités Incluses

✅ Validation frontend complète  
✅ Messages de feedback ergonomiques  
✅ Gestion d'erreurs détaillée  
✅ Animation fluide au chargement  
✅ Support du clavier (accessibilité)  
✅ Design responsive  
✅ Icônes Lucide React  
✅ Critères Bastien & Scapin appliqués  

---

## 🎓 Prochaines Étapes

1. **Test complet:** `node test-donations.js`
2. **Seed data:** `node seed-data.js`
3. **Formulaire:** Accédez à `/donate`
4. **Validation:** Enregistrez un don et vérifiez MongoDB

---

**Besoin d'aide?**
- Consultez [DONATION_GUIDE.md](./DONATION_GUIDE.md)
- Consultez [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- Vérifiez les logs: `npm run dev` (frontend)

**Créé avec ❤️ pour le bien des donneurs**
