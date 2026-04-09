const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const User = require('../models/User');

router.post('/send', async (req, res) => {
    try {
        const { hospitalId, bloodGroupNeeded, message } = req.body;

        // Vérifier hôpital
        const hospital = await User.findById(hospitalId);
        if (!hospital || hospital.role !== "hospital") {
            return res.status(400).json({ error: "Hôpital invalide" });
        }

        // Trouver donneurs compatibles
        const donors = await User.find({
            role: "donor",
            bloodGroup: bloodGroupNeeded,
            isAvailable: true
        });

        // Simulation SMS
        console.log(`🚨 Alerte envoyée par ${hospital.hospitalName}`);
        console.log(`${donors.length} donneurs notifiés`);

        // Sauvegarde en DB
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