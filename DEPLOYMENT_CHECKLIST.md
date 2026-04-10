✅ CHECKLIST DÉPLOIEMENT RAKITRA RA
===================================

## Phase 1 : Vérifications Locales ✓

- [x] Backend se connecte à MongoDB Atlas
- [x] Frontend build sans erreur (npm run build)
- [x] Route `/api/auth/donor-login` fonctionne
- [x] Authentification par téléphone + mot de passe OK
- [x] Formulaire don avec validation 56 jours OK
- [x] Toggle disponibilité donneur OK
- [x] localStorage correct après connexion

---

## Phase 2 : Tests Fonctionnels À Faire

### Authentification
- [ ] Tester connexion avec identifiants corrects
- [ ] Tester connexion avec mauvais mot de passe
- [ ] Tester connexion avec numéro inexistant
- [ ] Vérifier que l'utilisateur est stocké dans localStorage

### Profil Donneur
- [ ] Affichage du profil complet
- [ ] Toggle disponibilité fonctionne
- [ ] Feedback message après changement
- [ ] Historique des dons s'affiche

### Formulaire Don
- [ ] Remplir le formulaire et soumettre
- [ ] Tester validation 56 jours (bloquer si < 56j)
- [ ] Message d'erreur avec jours restants
- [ ] Succès et redirection OK

---

## Phase 3 : Préparation Production

### Variables d'environnement
- [ ] `MONGO_URI` correct dans backend/.env
- [ ] `PORT` défini (par défaut 5000)
- [ ] Pas de secrets en dur dans le code

### MongoDB Atlas
- [ ] IP whitelistée ou 0.0.0.0/0 autorisé
- [ ] Base `rakitra_ra_db` existe
- [ ] Collections créées (users, donations, alerts)
- [ ] Index sur phone (unique) pour rapide recherche

### Frontend
- [ ] `npm run build` réussit
- [ ] Tous les warnings résolus
- [ ] API baseURL correct : `http://localhost:5000/api`

### Backend
- [ ] Tous les imports corrects
- [ ] Pas d'erreurs console au démarrage
- [ ] Routes testées avec Postman/curl

---

## Phase 4 : Performance & Optimisation

- [ ] Temps de connexion < 2s
- [ ] Temps de chargement profil < 1s
- [ ] Pas de fuites mémoire (heap warnings)
- [ ] Gestion d'erreur gracieuse

---

## Phase 5 : Sécurité

- [ ] Mots de passe hachés avec bcrypt ✅
- [ ] Validation rôle 'donor' ✅
- [ ] Pas de token/password en logs
- [ ] CORS configuré correctement ✅
- [ ] Validation input: phone, password, montant

---

## Phase 6 : Données de Test

### Créer utilisateurs test
```javascript
// Exécuter via seed-data.js ou Compass
{
  phone: "034 00 000 01",
  password: "Rakitra123!",
  role: "donor",
  name: "Test Donneur",
  bloodGroup: "O+",
  location: "Antananarivo",
  isAvailable: true
}
```

---

## Phase 7 : Déploiement

### Backend (Node.js)
Options :
- [ ] Heroku (gratuit pour test)
- [ ] Railway.app
- [ ] DigitalOcean
- [ ] AWS EC2

Commandes :
```bash
# Build
npm install
# Run
node server.js
```

### Frontend (React)
Options :
- [ ] Vercel (recommandé pour Vite)
- [ ] Netlify
- [ ] GitHub Pages
- [ ] AWS S3 + CloudFront

Commandes :
```bash
npm run build
# Déployer le dossier dist/
```

---

## Phase 8 : Post-Déploiement

- [ ] Tester URLs de production
- [ ] Vérifier CORS depuis domaine final
- [ ] Tester authentification en production
- [ ] Vérifier logs serveur
- [ ] Performance acceptable

---

## 🎯 Priorités (MVP)

**ESSENTIEL** :
1. ✅ Connexion sécurisée
2. ✅ Affichage profil + historique
3. ✅ Enregistrement don avec validation 56j
4. ✅ Gestion disponibilité

**IMPORTANT** :
5. Points de collecte filtrés
6. Messages d'erreur clairs
7. Feedback UX

**OPTIONNEL** (v2) :
- Notifications
- Alertes compatibilité sang
- Stats détaillées
- Authentification SMS

---

## 📞 Contacts Utiles

- MongoDB Atlas Support : https://www.mongodb.com/support
- Node.js Docs : https://nodejs.org/
- React Docs : https://react.dev/

---

## ✅ Statut Final

**Dernière mise à jour** : 10 avril 2026  
**Status Général** : 🟢 PRÊT POUR HACKATHON

---

### Prochaines Actions
1. [ ] Exécuter la checklist tests fonctionnels
2. [ ] Vérifier chaque route avec curl/Postman
3. [ ] Tester avec vrais utilisateurs
4. [ ] Déployer en production
5. [ ] Monitor les logs en temps réel
