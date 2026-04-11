const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');

// Route POST /api/alerts/send
// Permet à un hôpital d'envoyer une alerte à des donneurs disponibles.
router.post('/send', async (req, res) => {
    try {
        const { hospitalId, bloodGroupNeeded, message } = req.body;

        // Vérifier que l'hôpital existe et a bien le rôle hospital
        const hospital = await User.findById(hospitalId);
        if (!hospital || hospital.role !== "hospital") {
            return res.status(400).json({ error: "Hôpital invalide" });
        }

        // Rechercher les donneurs disponibles du groupe sanguin demandé
        const donors = await User.find({
            role: "donor",
            bloodGroup: bloodGroupNeeded,
            isAvailable: true
        });

        // Simulation de l'envoi de notification
        console.log(`🚨 Alerte envoyée par ${hospital.name}`);
        console.log(`${donors.length} donneurs notifiés`);

        // Enregistrer l'alerte dans la base de données
        const alert = new Alert({
            hospitalId,
            bloodGroupNeeded,
            message,
            status: "sent",
            donorsNotified: donors.length
        });

        await alert.save();

        res.status(200).json({
            message: `${donors.length} donneurs alertés`,
            alert
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route POST /api/alerts/individual
// Permet d'alerter un donneur spécifique (Simulation SMS)
router.post('/individual', async (req, res) => {
    try {
        const { hospitalId, donorId, message } = req.body;

        const hospital = await User.findById(hospitalId);
        const donor = await User.findById(donorId);

        if (!hospital || !donor) {
            return res.status(404).json({ error: "Hôpital ou donneur non trouvé" });
        }

        // Simulation SMS
        console.log(`📱 [SMS Simulation] Vers ${donor.phone}: "${message}"`);

        const alert = new Alert({
            hospitalId,
            bloodGroupNeeded: donor.bloodGroup,
            message: `INDIVIDUAL SMS to ${donor.name}: ${message}`,
            status: "sent",
            donorsNotified: 1
        });

        await alert.save();

        res.json({ message: `SMS envoyé à ${donor.name}`, alert });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;