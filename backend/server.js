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

// --- ROUTES AUTHENTIFICATION ---

// Inscription : C'est cette route que Postman va appeler
app.post('/api/auth/register', async (req, res) => {
    try {
        // On crée un nouvel utilisateur avec les données envoyées par Postman (req.body)
        const newUser = new User(req.body);
        await newUser.save();
        
        res.status(201).json({ 
            message: "Utilisateur créé avec succès !", 
            user: newUser 
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ 
            error: "Erreur lors de l'inscription", 
            details: err.message 
        });
    }
});

// --- ROUTES RECHERCHE ---

// Recherche de donneurs pour l'hôpital
// Recherche intelligente de donneurs compatibles
app.get('/api/donors/search', async (req, res) => {
    try {
        const { bloodGroup } = req.query; // Ex: "A+"
        
        // La Matrice de Compatibilité (Le Cerveau de l'app)
        const compatibilityMap = {
            "O-": ["O-"],
            "O+": ["O+", "O-"],
            "A-": ["A-", "O-"],
            "A+": ["A+", "A-", "O+", "O-"],
            "B-": ["B-", "O-"],
            "B+": ["B+", "B-", "O+", "O-"],
            "AB-": ["AB-", "A-", "B-", "O-"],
            "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"] // Receveur universel
        };

        const compatibleTypes = compatibilityMap[bloodGroup];

        if (!compatibleTypes) {
            return res.status(400).json({ error: "Groupe sanguin invalide" });
        }

        // On utilise l'opérateur $in de MongoDB pour chercher TOUS les compatibles
        const donors = await User.find({ 
            role: 'donor', 
            bloodGroup: { $in: compatibleTypes }, 
            isAvailable: true 
        });
        
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

// --- ROUTE ALERTE (SIMULATION SMS/EMAIL) ---

app.post('/api/alerts/send', async (req, res) => {
    try {
        const { hospitalName, donorIds, bloodGroupNeed } = req.body;

        // Ici, plus tard, on mettra le vrai code de l'API Africa's Talking ou Nodemailer.
        // Pour le MVP (Hackathon), on simule le succès dans le terminal du serveur.
        
        console.log(`\n🚨 ALERTE URGENCE DÉCLENCHÉE PAR : ${hospitalName} 🚨`);
        console.log(`📩 Envoi de SMS à ${donorIds.length} donneurs compatibles pour du sang ${bloodGroupNeed}...`);
        console.log(`✅ SMS envoyés avec succès !\n`);

        // On renvoie un succès au Front-End (React affichera une belle notification verte)
        res.status(200).json({ 
            message: `${donorIds.length} donneurs ont été alertés par SMS avec succès !` 
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'envoi des alertes" });
    }
});

// Modifier la disponibilité d'un donneur
app.patch('/api/donors/:id/availability', async (req, res) => {
    try {
        const { isAvailable } = req.body; // true ou false
        
        const updatedDonor = await User.findByIdAndUpdate(
            req.params.id, 
            { isAvailable: isAvailable },
            { new: true } // Renvoie le document mis à jour
        );

        res.json({ 
            message: "Statut du donneur mis à jour", 
            donor: updatedDonor 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- ROUTE STATISTIQUES DASHBOARD ---
app.get('/api/stats', async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const availableDonors = await User.countDocuments({ role: 'donor', isAvailable: true });
        const totalDonations = await Donation.countDocuments();

        res.json({
            totalDonors,
            availableDonors,
            totalDonations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🌍 Serveur Rakitra Ra opérationnel sur le port ${PORT}`);
});