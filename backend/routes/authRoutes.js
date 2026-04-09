const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Inscription utilisateur
router.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json({
            message: "Utilisateur créé avec succès !",
            user: newUser
        });
    } catch (err) {
        res.status(400).json({
            error: "Erreur lors de l'inscription",
            details: err.message
        });
    }
});

module.exports = router;