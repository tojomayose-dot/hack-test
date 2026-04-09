const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');

router.get('/', async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const availableDonors = await User.countDocuments({
            role: 'donor',
            isAvailable: true
        });
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

module.exports = router;