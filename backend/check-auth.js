/**
 * check-auth.js
 * Script pour diagnostiquer les problèmes d'authentification
 * Utilisation: node check-auth.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blood-donation');
    console.log('\n✓ Connexion à MongoDB réussie\n');
  } catch (err) {
    console.error('✗ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
};

const checkAndFixPasswords = async () => {
  try {
    console.log('🔍 DIAGNOSTIC AUTHENTIFICATION\n');

    // Récupérer tous les utilisateurs
    const users = await User.find();
    console.log(`Utilisateurs trouvés: ${users.length}\n`);

    for (const user of users) {
      console.log(`\n📊 Utilisateur: ${user.name}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password (raw): ${user.password}`);
      console.log(`   Is hashed (starts with $2): ${user.password?.startsWith('$2')}`);

      // Si le password n'est pas hashé, le hasher
      if (user.password && !user.password.startsWith('$2')) {
        console.log(`   ⚠️ Password en texte brut détecté!`);
        
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(`   🔒 Hashage en cours...`);
        console.log(`   Hashed password: ${hashedPassword}`);
        
        // Mettre à jour
        user.password = hashedPassword;
        await user.save();
        console.log(`   ✅ Password hashé et sauvegardé`);
      }
    }

    console.log('\n✅ Diagnostic terminé\n');

    // Test de connexion avec le premier donneur
    console.log('🧪 TEST DE CONNEXION\n');
    const testUser = await User.findOne({ role: 'donor' });
    if (testUser) {
      console.log(`Utilisateur de test: ${testUser.name}`);
      console.log(`Phone: ${testUser.phone}`);
      
      // Tester avec bcrypt
      const testPassword = 'password123';
      const isMatch = await bcrypt.compare(testPassword, testUser.password);
      console.log(`\nComparaison bcrypt('password123', stored_password): ${isMatch}`);
    }

  } catch (err) {
    console.error('✗ Erreur:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

connectDB().then(() => checkAndFixPasswords());
