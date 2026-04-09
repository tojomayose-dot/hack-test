const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
    try {
        const { phone, password } = req.body;

        const existing = await User.findOne({ phone });
        if (existing) {
            return res.status(400).json({ error: "Utilisateur existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Utilisateur créé",
            user: newUser
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;