const mongoose = require('mongoose');

// Fonction de connexion à MongoDB avec gestion d'erreur
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://tojomayose_db_user:0000@cluster0.p36bs3l.mongodb.net/rakitra_ra_db?retryWrites=true&w=majority';
        console.log("Utilisation de MONGO_URI:", mongoUri);
        await mongoose.connect(mongoUri);
        console.log(" Rakitra Ra : Base de données connectée !");
    } catch (err) {
        console.error(" Erreur de connexion Mongo:", err);
        process.exit(1);
    }
};

module.exports = connectDB;