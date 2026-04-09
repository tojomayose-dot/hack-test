require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const donationRoutes = require('./routes/donationRoutes');
const alertRoutes = require('./routes/alertRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion DB
connectDB();

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);

// Lancement serveur
const PORT = process.env.PORT || 5000;
// On ajoute '0.0.0.0' pour ouvrir le serveur au réseau local
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 Serveur Rakitra Ra opérationnel !`);
    console.log(`📡 Local: http://localhost:${PORT}`);
    console.log(`🔗 Réseau: http://VOTRE_IP_LOCALE:${PORT}`);
});