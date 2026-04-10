const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/hospitals
// Retourne la liste des hôpitaux enregistrés
router.get('/', async (req, res) => {
    try {
        const hospitals = await User.find({ role: 'hospital' }, 'hospitalName name location email phone');
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
