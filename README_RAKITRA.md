🩸 RAKITRA RA - Système Intégré de Don de Sang
==============================================

## 📋 Vue d'ensemble

**Rakitra Ra** est une application MERN (MongoDB, Express, React, Node.js) permettant aux donneurs de sang de :
- ✅ Se connecter de manière sécurisée avec téléphone + mot de passe
- ✅ Gérer leur profil et disponibilité
- ✅ Consulter l'historique de leurs dons
- ✅ Trouver les centres de collecte proches
- ✅ S'enregistrer pour un don avec validation de sécurité (56 jours minimum)

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 14+
- npm ou yarn
- Accès à MongoDB Atlas

### Installation

```bash
# 1. Cloner ou télécharger le projet
cd /home/hans/Documents/hack-test

# 2. Installer les dépendances
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Vérifier le fichier .env
cat backend/.env
# Doit contenir: MONGO_URI=mongodb+srv://tojomayose_db_user:0000@cluster0.p36bs3l.mongodb.net/rakitra_ra_db?retryWrites=true&w=majority
```

### Lancer l'application

**Option 1 : Script automatisé (Linux/Mac)**
```bash
chmod +x start.sh
./start.sh
```

**Option 2 : Manuellement (2 terminaux)**

Terminal 1 - Backend:
```bash
cd backend
node server.js
# Devrait afficher: ✅ Rakitra Ra : Base de données connectée !
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Ouvre http://localhost:5173
```

---

## 🔐 Authentification Donneur

### Connexion
- **URL** : http://localhost:5173/login-donneur
- **Champs** : 
  - Numéro de téléphone
  - Mot de passe (avec toggle affichage/masquage)
- **Route Backend** : `POST /api/auth/donor-login`

### Validation
- ✅ Vérifie que l'utilisateur existe
- ✅ Compare le mot de passe avec bcrypt
- ✅ Vérifie que le rôle est 'donor'
- ✅ Stocke l'utilisateur dans localStorage

---

## 👤 Espace Donneur (DonorSpace)

### Profil
- Affiche : Nom, Groupe Sanguin, Localisation
- **Toggle Disponibilité** : Active/désactive l'accès aux points de collecte
  - Route : `PATCH /api/donors/:id/availability`
  - Feedback immédiat avec messages contextualisés

### Historique de Dons
- Liste tous les dons du donneur
- Affiche : Date, Hôpital, Volume, Statut
- État vide avec appel à l'action

### Points de Collecte
- Affiche uniquement si donneur est disponible (isAvailable === true)
- Si indisponible : Message "Réactivez votre disponibilité"
- Filtre par nom/adresse
- Badge "✓ Pour vous" si groupe sanguin compatible

---

## 🩸 Enregistrement d'un Don

### Flux
1. Sélectionner un centre de collecte
2. Remplir le formulaire :
   - Date du don
   - État de santé
   - Quantité (ml)

### Validations
✅ **Validation 56 jours** :
- Récupère le dernier don du donneur
- Calcule l'intervalle en jours
- Si < 56 jours : Bloque avec message clair + jours restants
- Si ≥ 56 jours : Autorise l'enregistrement

✅ **Validation métier** :
- Tous les champs requis
- Quantité > 0

### Réponse serveur
- ✅ Succès : Redirection + message de confirmation
- ❌ Erreur : Message détaillé + possibilité de réessayer

---

## 🛢️ Base de Données MongoDB

### Collections

**Users**
```javascript
{
  _id: ObjectId,
  phone: String (unique),
  password: String (bcryptées),
  name: String,
  email: String (optionnel),
  role: "donor" | "hospital",
  bloodGroup: "O+" | "A+" | ... (pour donors),
  location: String,
  isAvailable: Boolean (default: true),
  hospitalName: String (pour hospitals),
  language: "fr" | "mg",
  timestamps: {...}
}
```

**Donations**
```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref User),
  hospitalId: ObjectId (ref User),
  donationDate: Date,
  healthNote: String,
  amount: Number,
  status: "pending" | "completed",
  timestamps: {...}
}
```

---

## 🔧 Configuration MongoDB Atlas

### Vérifier la connexion
```bash
cd backend
node diagnose-mongodb.js
```

### Si erreur ETIMEDOUT
1. Allez sur https://cloud.mongodb.com/
2. Security → Network Access
3. Cliquez "+ ADD IP ADDRESS"
4. Options :
   - **Développement** : "Add Current IP Address"
   - **Hackathon** : Entrez "0.0.0.0/0" (tous les IPs)

---

## 📁 Structure du Projet

```
hack-test/
├── backend/
│   ├── server.js                 # Entrée principal
│   ├── package.json
│   ├── .env                      # Variables d'environnement
│   ├── config/
│   │   └── db.js                 # Connexion MongoDB
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── Alert.js
│   ├── routes/
│   │   ├── authRoutes.js         # Authentification
│   │   ├── donationRoutes.js
│   │   ├── donorRoutes.js
│   │   └── ...
│   └── controllers/
│       └── donorController.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── DonorLoginPage/   # Connexion
│   │   │   ├── DonorSpace/       # Profil + historique
│   │   │   ├── DonationFormPage/ # Formulaire don
│   │   │   └── ...
│   │   └── services/
│   │       └── api.js             # Axios instance
│   ├── package.json
│   └── vite.config.js
│
├── start.sh                      # Script démarrage
├── MONGODB_SETUP_GUIDE.md        # Guide MongoDB Atlas
└── README.md                     # Ce fichier
```

---

## 🧪 Routes API Principales

### Authentication
- `POST /api/auth/register` - Inscription (avec bcrypt)
- `POST /api/auth/login` - Connexion générale
- `POST /api/auth/donor-login` - Connexion donneur (phone + password)

### Donations
- `POST /api/donations` - Créer un don
- `GET /api/donations/:donorId` - Historique du donneur

### Donors
- `PATCH /api/donors/:id/availability` - Modifier disponibilité

---

## 🔒 Sécurité

✅ **Implémentée** :
- Mots de passe hachés avec bcrypt
- Validation du rôle donneur
- localStorage sécurisé après connexion
- Validation 56 jours avant enregistrement
- Messages d'erreur clairs sans révéler de détails sensibles

---

## 🐛 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les dépendances
cd backend && npm install

# Vérifier le .env
cat .env

# Diagnostiquer MongoDB
node diagnose-mongodb.js
```

### Frontend ne se compile pas
```bash
cd frontend
npm install
npm run build
```

### Connexion impossible
1. Vérifiez que le backend tourne : `curl http://localhost:5000/api/donors`
2. Vérifiez votre IP dans MongoDB Atlas Network Access
3. Vérifiez les credentials : username/password dans le .env

---

## 📞 Informations de Test

**Compte de test (si seed-data.js a été exécuté)** :
- Téléphone : Vérifiez dans MongoDB Compass
- Mot de passe : Défini lors du seed
- URL : http://localhost:5173/login-donneur

---

## 📝 Notes

- Application développée pour hackathon
- Frontend : React + Vite + Tailwind CSS
- Backend : Express + Mongoose
- Authentification : localStorage + routes sécurisées
- Production : Ajouter JWT, validations supplémentaires, HTTPS

---

**Dernière mise à jour** : 10 avril 2026  
**Status** : ✅ Prêt pour production hackathon
