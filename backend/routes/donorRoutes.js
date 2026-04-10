const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Recherche donneurs compatibles
router.get('/search', async (req, res) => {
    try {
        const { bloodGroup } = req.query;

        // SI AUCUN GROUPE N'EST PRÉCISÉ : On renvoie tout le monde
        if (!bloodGroup) {
            const allDonors = await User.find({ role: 'donor', isAvailable: true });
            return res.json(allDonors);
        }

        const compatibilityMap = {
            "O-": ["O-"],
            "O+": ["O+", "O-"],
            "A-": ["A-", "O-"],
            "A+": ["A+", "A-", "O+", "O-"],
            "B-": ["B-", "O-"],
            "B+": ["B+", "B-", "O+", "O-"],
            "AB-": ["AB-", "A-", "B-", "O-"],
            "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"]
        };

        const compatibleTypes = compatibilityMap[bloodGroup];

        if (!compatibleTypes) {
            return res.status(400).json({ error: "Groupe sanguin invalide" });
        }

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

// Modifier disponibilité donneur
router.patch('/:id/availability', async (req, res) => {
    try {
        const { isAvailable } = req.body;

        const updatedDonor = await User.findByIdAndUpdate(
            req.params.id,
            { isAvailable },
            { new: true }
        );

        res.json({
            message: "Statut du donneur mis à jour",
            donor: updatedDonor
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;