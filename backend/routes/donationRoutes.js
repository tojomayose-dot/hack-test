const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');

// Route POST /api/donations
// Crée un nouvel enregistrement de don en vérifiant les IDs fournis
router.post('/', async (req, res) => {
    try {
        const { donorId, hospitalId } = req.body;

        const donor = await User.findById(donorId);
        const hospital = await User.findById(hospitalId);

        if (!donor || donor.role !== "donor") {
            return res.status(400).json({ error: "Donneur invalide" });
        }

        if (!hospital || hospital.role !== "hospital") {
            return res.status(400).json({ error: "Hôpital invalide" });
        }

        const donation = new Donation(req.body);
        await donation.save();

        res.status(201).json(donation);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route GET /api/donations
// Retourne tous les dons avec informations détaillées
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('donorId', 'name phone bloodGroup')
            .populate('hospitalId', 'hospitalName location');

        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route GET /api/donations/:donorId
// Retourne l'historique des dons pour un donneur donné
router.get('/:donorId', async (req, res) => {
    try {
        const history = await Donation.find({ donorId: req.params.donorId })
            .populate('hospitalId', 'name location');

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;