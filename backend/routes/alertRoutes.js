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

module.exports = router;