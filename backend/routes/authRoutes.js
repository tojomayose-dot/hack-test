const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route POST /api/auth/register
// Crée un nouvel utilisateur (donneur ou autre rôle) avec mot de passe chiffré.
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

// Route POST /api/auth/login
// Authentifie l'utilisateur et retourne un token JWT.
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({
            message: "Connexion réussie",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;