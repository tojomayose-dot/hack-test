const mongoose = require('mongoose');

// Fonction de connexion à MongoDB avec gestion d'erreur robuste
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error(
                'MONGO_URI non défini. Veuillez créer un fichier .env avec MONGO_URI=' +
                'mongodb+srv://[user]:[password]@[cluster].mongodb.net/[database]'
            );
        }

        console.log('\n💡 Connexion à MongoDB Atlas...');
        console.log('   URI:', mongoUri.replace(/:[^:]*@/, ':****@')); // Masquer le password

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority'
        });

        console.log('✅ Rakitra Ra : Base de données connectée !');
        return true;
    } catch (err) {
        console.error('\n❌ Erreur de connexion MongoDB:');
        
        // Diagnostiquer le type d'erreur
        if (err.message.includes('MONGO_URI')) {
            console.error('   Cause: MONGO_URI manquant ou vide');
            console.error('   Solution: Créez un fichier .env avec la chaîne de connexion');
        } else if (err.message.includes('ETIMEDOUT') || err.code === 'ETIMEDOUT') {
            console.error('   Cause: Timeout réseau (problème de connectivité)');
            console.error('   Solutions possibles:');
            console.error('   1. Vérifiez votre connexion internet');
            console.error('   2. Ajoutez votre IP à MongoDB Atlas Network Access');
            console.error('   3. Ou autorisez 0.0.0.0/0 (tous les IPs)');
        } else if (err.message.includes('authentication failed')) {
            console.error('   Cause: Identifiants invalides (user/password)');
            console.error('   Solution: Vérifiez les credentials dans MongoDB Atlas');
        } else if (err.message.includes('invalid namespace')) {
            console.error('   Cause: Base de données inexistante');
            console.error('   Solution: Vérifiez que rakitra_ra_db existe dans l\'URI');
        } else {
            console.error('   Erreur:', err.message);
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;