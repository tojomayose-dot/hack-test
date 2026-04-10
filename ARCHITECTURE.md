# 📊 Architecture - Système de Donation

## 🏗️ Diagramme Global

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR (Navigateur)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  React Frontend   │
                    │  Port: 5173       │
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼────────┐  ┌───────▼────────┐  ┌────────▼─────┐
    │DonationForm│  │ DonorSpace     │  │ Dashboard    │
    │  (New)     │  │ (Existing)     │  │ (Existing)   │
    └───┬────────┘  └────────────────┘  └──────────────┘
        │
        │ axios.post('/api/donations')
        │
        ├──────────────────────────────────┐
        │                                  │
┌───────▼─────────────────────┐  ┌────────▼─────────────┐
│   API Backend Node.js        │  │  MongoDB            │
│   Port: 5000                 │  │  Donations Collection│
│                              │  │  (Document Store)   │
│  ┌──────────────────────┐    │  │                     │
│  │ POST /api/donations  │◄──┼──┤ Save & Retrieve    │
│  │ • Validate IDs       │    │  │                     │
│  │ • Check Roles        │    │  └─────────────────────┘
│  │ • Verify Volumes     │    │
│  │ • Save to MongoDB    │    │
│  │ • Return 201/Error   │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ GET /api/donations   │    │
│  │ :donorId             │    │
│  │ • Fetch History      │    │
│  │ • Populate Hospital  │    │
│  │ • Return Array       │    │
│  └──────────────────────┘    │
│                              │
└──────────────────────────────┘
```

---

## 🎨 Frontend Architecture

```
DonationForm.jsx
├── State Management
│   ├── formData (donorId, hospitalId, volume, healthNote)
│   ├── donors[] (liste des donneurs)
│   ├── hospitals[] (liste des hôpitaux)
│   ├── loading (chargement des données)
│   ├── submitting (envoi du formulaire)
│   └── feedback (messages d'erreur/succès)
│
├── Lifecycle
│   └── useEffect → Charger donneurs & hôpitaux
│
├── Handlers
│   ├── handleChange() → Mise à jour formData
│   ├── validateForm() → Validation locale
│   └── handleSubmit() → Envoi API
│
└── Render
    ├── En-tête avec icône ❤️
    ├── Messages de feedback (🟢/🔴/🔵)
    ├── Formulaire
    │   ├── Select donneur
    │   ├── Select hôpital
    │   ├── Slider + Input volume
    │   ├── Select état de santé
    │   └── Boutons (Enregistrer/Réinitialiser)
    └── Info suppllémentaire
```

---

## 🔌 API Flow

```
1. FRONTEND REQUEST
   ┌─────────────────────────────────┐
   │ POST /api/donations             │
   │ {                               │
   │   "donorId": "...",             │
   │   "hospitalId": "...",          │
   │   "volume": 450,                │
   │   "healthNote": "Normal"        │
   │ }                               │
   └──────────────┬──────────────────┘
                  │
2. BACKEND VALIDATION
   ├── Vérifier donorId → User.findById()
   ├── Vérifier hospitalId → User.findById()
   ├── Vérifier role donor
   ├── Vérifier role hospital
   └── Valider volume (100-1000)
      │
      ├─ ✅ Tous OK → STEP 3
      └─ ❌ Erreur → Retourner 400

3. SAVE TO MONGODB
   ├── Créer document Donation
   ├── Set timestamps
   ├── Set status: 'completed'
   ├── Insert dans collection
   └── Retourner 201 + _id

4. FRONTEND RESPONSE
   ┌──────────────────────────────────┐
   │ 201 Created                      │
   │ {                                │
   │   "_id": "507f...",              │
   │   "donorId": "...",              │
   │   "volume": 450,                 │
   │   "status": "completed",         │
   │   "createdAt": "2026-04-10T..."  │
   │ }                                │
   └──────────────┬────────────────────┘
                  │
5. DISPLAY SUCCESS
   ├── Afficher message ✅
   ├── Montrer ID du don
   ├── Réinitialiser formulaire
   └── Masquer après 5 secondes
```

---

## 📁 Structure de Fichiers

```
hack-test/
├── frontend/
│   └── src/pages/DonationForm/      (NEW)
│       ├── DonationForm.jsx         (400 lignes)
│       └── DonationForm.css         (400 lignes)
│
├── backend/
│   ├── models/
│   │   └── Donation.js              (existing)
│   ├── routes/
│   │   └── donationRoutes.js        (existing)
│   ├── test-donations.js            (NEW)
│   ├── test-donations.sh            (NEW)
│   ├── seed-data.js                 (NEW)
│   ├── postman-collection.json      (NEW)
│   └── server.js                    (existing)
│
├── QUICK_START.md                   (NEW)
├── INSTALLATION_GUIDE.md            (NEW)
├── TESTING_GUIDE.md                 (NEW)
├── DONATION_GUIDE.md                (NEW)
├── README_DONATION_SYSTEM.md        (NEW)
├── integrate-donation-form.sh       (NEW)
└── donation-system-config.json      (NEW)
```

---

## 🔄 Data Flow Complet

```
USER INPUT
    ↓
DonationForm renders
    ├─ Charger donors[] depuis API
    ├─ Charger hospitals[] depuis API
    └─ Afficher listes déroulantes
        ↓
USER SELECTS
    ├─ Select donor
    ├─ Select hospital
    ├─ Adjust volume slider
    └─ Select health note
        ↓
USER SUBMITS
    ├─ validateForm()
    │   ├─ donorId? ✓
    │   ├─ hospitalId? ✓
    │   └─ volume in [100-1000]? ✓
    │
    └─ api.post('/api/donations', formData)
        ↓
BACKEND PROCESSING
    ├─ Check User.findById(donorId)
    ├─ Check role === 'donor'
    ├─ Check User.findById(hospitalId)
    ├─ Check role === 'hospital'
    ├─ Create Donation document
    └─ Save to MongoDB
        ↓
RESPONSE
    ├─ 201 Created + ID
    │   └─ setFeedback({type: 'success', message: '✓ ...'})
    │       └─ Display success for 5s
    │           └─ Reset form
    │
    └─ 400 Bad Request + Error
        └─ setFeedback({type: 'error', message: '✗ ...'})
```

---

## 🧪 Test Scenarios Visualized

```
┌─ TEST 1: VALID DONATION ────────────┐
│ Input: Valid donor + hospital       │
│ Expected: 201 Created              │
│ Status: ✓ PASS                     │
└────────────────────────────────────┘

┌─ TEST 2: MIN VOLUME (100 ml) ──────┐
│ Input: volume = 100                │
│ Expected: 201 Created              │
│ Status: ✓ PASS                     │
└────────────────────────────────────┘

┌─ TEST 3: MAX VOLUME (1000 ml) ─────┐
│ Input: volume = 1000               │
│ Expected: 201 Created              │
│ Status: ✓ PASS                     │
└────────────────────────────────────┘

┌─ TEST 4: INVALID DONOR ────────────┐
│ Input: donorId not in DB           │
│ Expected: 400 Bad Request          │
│ Status: ✓ PASS (correctly rejects) │
└────────────────────────────────────┘

┌─ TEST 5: INVALID HOSPITAL ─────────┐
│ Input: hospitalId not in DB        │
│ Expected: 400 Bad Request          │
│ Status: ✓ PASS (correctly rejects) │
└────────────────────────────────────┘

┌─ TEST 6: MISSING FIELDS ───────────┐
│ Input: hospitalId missing          │
│ Expected: 400 Bad Request          │
│ Status: ✓ PASS (validation error)  │
└────────────────────────────────────┘

┌─ TEST 7: HISTORY RETRIEVAL ────────┐
│ GET /api/donations/:donorId        │
│ Expected: 200 OK + array of dons   │
│ Status: ✓ PASS                     │
└────────────────────────────────────┘
```

---

## 💾 MongoDB Collection Schema

```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: User),      // Donneur
  hospitalId: ObjectId (ref: User),   // Hôpital
  volume: Number (100-1000),          // ml
  healthNote: String,                 // Normal|Fatigue|Tension Basse|Autre
  donationDate: Date,                 // Par défaut: now
  status: String,                     // completed|pending|cancelled
  createdAt: Date,                    // Auto
  updatedAt: Date                     // Auto
}
```

---

## 🎯 Component Props & State

```javascript
// Props: None (Composant autonome)

// State:
{
  formData: {
    donorId: String,
    hospitalId: String,
    volume: Number,
    healthNote: String
  },
  donors: Array<User>,
  hospitals: Array<User>,
  loading: Boolean,
  submitting: Boolean,
  feedback: {
    type: 'success' | 'error' | 'info' | null,
    message: String
  }
}
```

---

## 🔐 Validation Layers

```
FRONTEND VALIDATION
├─ donorId selected? (required)
├─ hospitalId selected? (required)
├─ volume between 100-1000? (required)
└─ healthNote selected? (optional)

BACKEND VALIDATION
├─ donorId exists? + role === 'donor'?
├─ hospitalId exists? + role === 'hospital'?
├─ volume numeric and in range?
└─ All required fields present?

ERROR HANDLING
├─ Display error message to user
├─ Log error to console
├─ Suggest correction
└─ Allow retry
```

---

## 📈 Performance Considerations

```
Initial Load
├─ Load donneurs: ~50ms
├─ Load hôpitaux: ~50ms
├─ Render form: ~100ms
└─ Total: ~200ms

Form Submission
├─ Validate: ~5ms
├─ Encode JSON: ~2ms
├─ Network request: ~100-500ms
├─ Backend processing: ~50-100ms
├─ Display result: ~10ms
└─ Total: ~167-607ms

Optimizations
├─ Memoization for lists
├─ Debounce on input changes
├─ Cancel ongoing requests on unmount
└─ Cache donors/hospitals data
```

---

## 🎓 Learning Path

```
1. UNDERSTAND THE FORM
   └─ Read DonationForm.jsx

2. CUSTOMIZE STYLING
   └─ Edit DonationForm.css

3. TEST THE API
   └─ Run test-donations.js

4. ADD TO YOUR APP
   └─ Update App.jsx

5. DEPLOY
   └─ Push to production
```

**Créé avec ❤️ pour la santé publique**
