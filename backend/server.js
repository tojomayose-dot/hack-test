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
app.listen(PORT, () => {
    console.log(`🌍 Serveur Rakitra Ra opérationnel sur le port ${PORT}`);
});