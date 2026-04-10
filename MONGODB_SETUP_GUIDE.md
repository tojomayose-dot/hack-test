📋 GUIDE COMPLET : Configuration MongoDB Atlas pour Rakitra Ra
================================================================

## ✅ STATUS ACTUEL
✓ Le backend est maintenant connecté à MongoDB Atlas
✓ Le fichier .env est chargé correctement
✓ La chaîne de connexion est valide

## 🔧 CONFIGURATION MONGODB ATLAS - GUIDE DÉTAILLÉ

### 1️⃣ VÉRIFIER LA CHAÎNE DE CONNEXION (MONGO_URI)

Votre URI actuelle dans .env :
```
mongodb+srv://tojomayose_db_user:0000@cluster0.p36bs3l.mongodb.net/rakitra_ra_db?retryWrites=true&w=majority
```

Cette URI doit avoir le format :
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]?retryWrites=true&w=majority
```

✅ Vérifications :
- ✓ Username: tojomayose_db_user
- ✓ Cluster: cluster0.p36bs3l
- ✓ Database: rakitra_ra_db
- ✓ Retries: Activé

---

### 2️⃣ CONFIGURER L'ACCÈS RÉSEAU DANS MONGODB ATLAS

#### Accédez à Network Access :
1. Allez sur https://cloud.mongodb.com/
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre cluster "cluster0"
4. Dans le menu de gauche → **Security** → **Network Access**

#### Option A : Ajouter votre IP actuelle (Recommandé en Dev)

1. Cliquez sur **+ ADD IP ADDRESS**
2. Cliquez sur **Add Current IP Address**
3. MongoDB détecte automatiquement votre IP
4. Ajoutez une description : "Hans Local Dev"
5. Cliquez **CONFIRM**

#### Option B : Autoriser tous les IPs (Hackathon - Non recommandé en prod)

1. Cliquez sur **+ ADD IP ADDRESS**
2. Entrez **0.0.0.0/0** dans le champ
3. Description : "Hackathon - Tous les IPs"
4. Cliquez **CONFIRM**

⚠️ Attention : 0.0.0.0/0 signifie n'importe qui peut se connecter. À utiliser uniquement pour hackathon/tests.

---

### 3️⃣ VÉRIFIER LES CREDENTIALS (USER/PASSWORD)

1. Dans MongoDB Atlas, allez sur **Security** → **Database Access**
2. Vérifiez l'utilisateur "tojomayose_db_user"
3. Si besoin, réinitialisez le mot de passe :
   - Cliquez sur les **trois points (...)** à côté de l'utilisateur
   - Sélectionnez **Edit Password**
   - Générez un nouveau mot de passe
   - Copie la nouvelle URI et mettez à jour le .env

---

### 4️⃣ VÉRIFIER LA BASE DE DONNÉES

1. Dans MongoDB Atlas, allez sur **Databases**
2. Vérifiez que "rakitra_ra_db" existe
3. Si elle n'existe pas :
   - Cliquez sur **+ CREATE** (elle se créera automatiquement lors de la première insertion)
   - Ou créez-la manuellement avec le nom "rakitra_ra_db"

---

### 5️⃣ DIAGNOSTIQUER LES ERREURS

#### Erreur : ETIMEDOUT
- ❌ Cause : Votre IP n'est pas whitelistée ou le pare-feu bloque
- ✅ Solution : Ajoutez votre IP à MongoDB Atlas Network Access

#### Erreur : authentication failed
- ❌ Cause : Username ou Password incorrect
- ✅ Solution : Vérifiez les credentials dans MongoDB Atlas Database Access

#### Erreur : invalid namespace
- ❌ Cause : La base "rakitra_ra_db" n'existe pas
- ✅ Solution : Créez la base ou elle se créera automatiquement

---

### 6️⃣ FICHIER .env CORRECT

Votre fichier `/home/hans/Documents/hack-test/backend/.env` doit contenir :

```
MONGO_URI=mongodb+srv://tojomayose_db_user:[PASSWORD]@cluster0.p36bs3l.mongodb.net/rakitra_ra_db?retryWrites=true&w=majority
PORT=5000
```

Remplacez `[PASSWORD]` par le mot de passe réel du user MongoDB Atlas.

---

### 7️⃣ TEST DE CONNEXION

Exécutez le backend :
```bash
cd /home/hans/Documents/hack-test/backend
node server.js
```

Vous devez voir :
```
✓ Variables d'environnement chargées depuis: ...
MONGO_URI après dotenv: Chargé ✓
💡 Connexion à MongoDB Atlas...
   URI: mongodb+srv://tojomayose_db_user:****@cluster0.p36bs3l.mongodb.net/rakitra_ra_db...
✅ Rakitra Ra : Base de données connectée !
Serveur démarré sur le port 5000
```

---

### 8️⃣ VÉRIFIER LES COLLECTIONS

Une fois connecté, testez que vos collections existent :

```bash
# Depuis un terminal MongoDB (mongo shell ou MongoDB Compass)
use rakitra_ra_db
db.users.findOne()
db.donations.findOne()
```

---

## 📝 RÉSUMÉ DE LA SOLUTION

✅ **Problème corrigé** : Le chemin du .env était incorrect
✅ **Ajustements** : Chargement relatif avec `path.join(__dirname, '.env')`
✅ **Messages** : Diagnostiques clairs pour chaque type d'erreur
✅ **Timeout** : Défini à 5s pour détecter rapidement les problèmes réseau

🎯 Prochaines étapes :
1. Vérifiez votre IP dans MongoDB Atlas Network Access
2. Relancez le backend : `node server.js`
3. Testez la connexion donneur : http://localhost:3000/login-donneur
