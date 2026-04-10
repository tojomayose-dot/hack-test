# 🚀 QUICK START - Formulaire Donation

## ⚡ 3 étapes en 2 minutes

### Étape 1: Ajouter la route (1 min)
Ouvrez `frontend/src/App.jsx` et ajoutez:

```jsx
import DonationForm from './pages/DonationForm/DonationForm';

// Dans Routes:
<Route path="/donate" element={<DonationForm />} />
```

### Étape 2: Insérer les données (30 sec)
```bash
cd backend
node seed-data.js
```

### Étape 3: Accéder au formulaire
```bash
cd frontend
npm run dev
# Puis ouvrez: http://localhost:5173/donate
```

---

## ✅ Fichiers Déjà Créés

```
✓ frontend/src/pages/DonationForm/DonationForm.jsx
✓ frontend/src/pages/DonationForm/DonationForm.css
✓ backend/test-donations.js
✓ backend/test-donations.sh
✓ backend/seed-data.js
✓ backend/postman-collection.json
✓ DONATION_GUIDE.md
✓ TESTING_GUIDE.md
✓ INSTALLATION_GUIDE.md
✓ README_DONATION_SYSTEM.md
```

---

## 🧪 Tester l'API
```bash
cd backend
node test-donations.js
```

---

## 📖 Guides Complets

- **Installation**: `INSTALLATION_GUIDE.md`
- **Tests**: `TESTING_GUIDE.md`  
- **Détails**: `DONATION_GUIDE.md`

---

**C'est prêt à l'emploi! 🎉**
