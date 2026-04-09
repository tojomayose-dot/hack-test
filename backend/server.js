require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importation des modèles structurés
const User = require('./models/User');
const Donation = require('./models/Donation');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONNEXION MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Rakitra Ra : Base de données connectée !"))
    .catch(err => console.error(" Erreur de connexion Mongo:", err));

// --- ROUTES API ---

// 1. Inscription (Donneur ou Hôpital)
app.post('/api/auth/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Erreur lors de l'inscription (Vérifiez si le numéro existe déjà)" });
    }
});

// 2. Récupérer tous les donneurs disponibles (Pour la recherche de l'hôpital)
app.get('/api/donors', async (req, res) => {
    try {
        const { bloodGroup, location } = req.query;
        let query = { role: 'donor', isAvailable: true };
        
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (location) query.location = new RegExp(location, 'i'); // Recherche insensible à la casse

        const donors = await User.find(query).select('-password'); // On cache les mots de passe
        res.json(donors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Enregistrer un nouveau don
app.post('/api/donations', async (req, res) => {
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();
        res.status(201).json(newDonation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Historique des dons d'un donneur spécifique
app.get('/api/donations/:donorId', async (req, res) => {
    try {
        const history = await Donation.find({ donorId: req.params.donorId })
            .populate('hospitalId', 'hospitalName location');
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌍 Serveur Rakitra Ra opérationnel sur le port ${PORT}`);
});