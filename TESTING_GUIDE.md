# 🧪 Guide de Test - API Donations

## 📌 Avant de commencer

Assurez-vous que :
1. MongoDB est en cours d'exécution
2. Le serveur backend est démarré (`node server.js`)
3. Les dépendances sont installées (`npm install`)

---

## 🚀 Étape 1: Insérer les données de test

### Avec le script seed-data.js

```bash
cd backend
node seed-data.js
```

**Résultat attendu:**
```
✓ Connexion à MongoDB réussie
✓ Collections vidées
✓ 4 donneur(s) créé(s)
✓ 3 hôpital(aux) créé(s)
✓ 4 don(s) créé(s)

============================================================
DONNÉES DE SEED INSÉRÉES AVEC SUCCÈS
============================================================

DONNEURS:
  • Jean Dupont (O+) - 507f1f77bcf86cd799439001
  • Marie Martin (A+) - 507f1f77bcf86cd799439002
  • Pierre Bernard (B-) - 507f1f77bcf86cd799439003
  • Sophie Leblanc (AB+) - 507f1f77bcf86cd799439004

HÔPITAUX:
  • Hôpital Central d'Antananarivo - 507f1f77bcf86cd799439011
  • Centre Médical Universitaire - 507f1f77bcf86cd799439012
  • Hôpital de la Croix-Rouge - Toliara - 507f1f77bcf86cd799439013
```

**Note:** Notez bien les IDs affichés, vous en aurez besoin pour les tests.

---

## 🧪 Étape 2: Tester l'API

### Option A: Script Node.js (Recommandé)

```bash
cd backend
node test-donations.js
```

✅ Meilleur pour : Tester tous les scénarios automatiquement

### Option B: Script Bash

```bash
cd backend
chmod +x test-donations.sh
./test-donations.sh
```

✅ Meilleur pour : Environnements Unix/Linux

### Option C: Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner `postman-collection.json`
4. Modifier les variables:
   - `base_url`: `http://localhost:5000`
   - `donor_id`: Utiliser un ID du seed
   - `hospital_id`: Utiliser un ID du seed
5. Exécuter les requêtes

✅ Meilleur pour : Tests manuels et visualisation

### Option D: cURL

```bash
# Test simple
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "507f1f77bcf86cd799439001",
    "hospitalId": "507f1f77bcf86cd799439011",
    "volume": 450,
    "healthNote": "Normal"
  }'

# Récupérer l'historique
curl -X GET http://localhost:5000/api/donations/507f1f77bcf86cd799439001
```

✅ Meilleur pour : Tests rapides en ligne de commande

---

## 📊 Scénarios de Test

### ✅ Scénarios de Succès

| # | Description | Status attendu |
|----|-------------|---|
| 1 | Donation valide (450 ml) | 201 Created |
| 2 | Donation volume min (100 ml) | 201 Created |
| 3 | Donation volume max (1000 ml) | 201 Created |
| 4 | Différents états de santé | 201 Created |
| 5 | Récupérer l'historique | 200 OK + array |

### ❌ Scénarios d'Erreur

| # | Description | Status attendu |
|----|-------------|---|
| 1 | Donneur invalide | 400 Bad Request |
| 2 | Hôpital invalide | 400 Bad Request |
| 3 | Champs manquants | 400 Bad Request |
| 4 | Volume en dehors des limites | ❓ À vérifier |

---

## 🎯 Tester le Formulaire React

### 1. Démarrer le serveur frontend

```bash
cd frontend
npm run dev
```

### 2. Accéder au formulaire

```
http://localhost:5173/donate
```

### 3. Checklist de test ergonomique

- [ ] Le formulaire charge correctement
- [ ] Les listes déroulantes affichent les donneurs/hôpitaux
- [ ] Le slider de volume fonctionne (100-1000 ml)
- [ ] Le message d'erreur s'affiche si un champ manque
- [ ] Le message de succès s'affiche après soumission
- [ ] L'ID du don est visible dans le message de confirmation
- [ ] Le formulaire se réinitialise après succès
- [ ] Le bouton "Réinitialiser" fonctionne
- [ ] Les icônes s'affichent correctement
- [ ] L'interface est responsive (testez sur mobile)

---

## 🔧 Configurations de Test

### Variables d'environnement

Créez un fichier `.env` dans `/backend`:

```env
MONGO_URI=mongodb://localhost:27017/blood-donation
PORT=5000
NODE_ENV=development
```

### Modifier l'URL API pour les tests

Dans `test-donations.js`:

```javascript
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
```

Utilisation:
```bash
API_URL=http://api.example.com node test-donations.js
```

---

## 📈 Résultats Attendus

### Après `node seed-data.js`

- ✅ 4 donneurs insertés
- ✅ 3 hôpitaux insertés
- ✅ 4 dons d'exemple créés

### Après `node test-donations.js`

```
✓ Créer une donation valide (Status: 201)
✓ Donner 100 ml (Status: 201)
✓ Donner 1000 ml (Status: 201)
✓ Rejeter donation avec donneur invalide (Status: 400)
✓ Rejeter donation avec hôpital invalide (Status: 400)
✓ Rejeter donation incomplète (Status: 400)
✓ Récupérer historique du donneur (Status: 200)
```

---

## 🐛 Troubleshooting

### Erreur: "Cannot find module 'mongoose'"

```bash
cd backend && npm install mongoose
```

### Erreur: "connect ECONNREFUSED localhost:5000"

Le backend n'est pas démarré. Exécutez:

```bash
cd backend
node server.js
```

### Erreur: "Aucun utilisateur trouvé"

Exécutez d'abord le seed:

```bash
node seed-data.js
```

### Erreur: "MongoServerError: connect ECONNREFUSED"

MongoDB n'est pas en cours d'exécution. Vérifiez:

```bash
# Sur Linux/Mac
sudo systemctl start mongod
# Ou avec Docker
docker run -d -p 27017:27017 mongo
```

---

## 📝 Exemple de Payload Complet

```json
{
  "donorId": "507f1f77bcf86cd799439001",
  "hospitalId": "507f1f77bcf86cd799439011",
  "volume": 450,
  "healthNote": "Normal"
}
```

**Réponse réussie (201):**

```json
{
  "_id": "507f1f77bcf86cd799439999",
  "donorId": "507f1f77bcf86cd799439001",
  "hospitalId": "507f1f77bcf86cd799439011",
  "volume": 450,
  "healthNote": "Normal",
  "donationDate": "2026-04-10T07:30:00.000Z",
  "status": "completed",
  "createdAt": "2026-04-10T07:30:00.000Z",
  "updatedAt": "2026-04-10T07:30:00.000Z"
}
```

---

## 🔗 Liens Utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Express.js](https://expressjs.com/)
- [Postman Download](https://www.postman.com/downloads/)
- [Bastien & Scapin Criteria](https://en.wikipedia.org/wiki/Ergonomic_criteria_for_web_design)

---

**Besoin d'aide?** Consultez [DONATION_GUIDE.md](../DONATION_GUIDE.md)
