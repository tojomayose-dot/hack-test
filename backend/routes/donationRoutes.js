const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');

// Nouveau don
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

// Historique
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