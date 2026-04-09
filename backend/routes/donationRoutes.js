const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Nouveau don
router.post('/', async (req, res) => {
    try {
        const newDonation = new Donation(req.body);
        await newDonation.save();
        res.status(201).json(newDonation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Historique dons
router.get('/:donorId', async (req, res) => {
    try {
        const history = await Donation.find({ donorId: req.params.donorId })
            .populate('hospitalId', 'hospitalName location');

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;