// Charger les variables d'environnement depuis le fichier .env si présent
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Importation des routeurs dédiés à chaque fonctionnalité
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');
const donorRoutes = require('./routes/donorRoutes');
const alertRoutes = require('./routes/alertRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middlewares globaux appliqués à toutes les routes
app.use(cors());
app.use(express.json());

// Établir la connexion à MongoDB avant de traiter les requêtes
connectDB();

// Montage des routes API par domaine
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);

// Démarrage du serveur HTTP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});