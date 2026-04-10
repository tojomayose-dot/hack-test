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

// Route POST /api/auth/donor-login
// Connexion sécurisée pour les donneurs avec vérification du mot de passe.
// Vérifie que l'utilisateur existe, a le rôle 'donor' et que le password est correct.
router.post('/donor-login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        console.log('\n🔐 AUTHENTIFICATION DONNEUR');
        console.log('   Phone reçu:', phone);
        console.log('   Password reçu:', password ? '***' : 'VIDE');

        if (!phone || phone.trim() === '') {
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        if (!password || password === '') {
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        // Recherche insensible aux espaces pour le phone
        const cleanPhone = phone.trim().replace(/\s+/g, '');
        console.log('   Phone normalisé:', cleanPhone);

        // Chercher l'utilisateur - essayer avec exactitude d'abord
        let user = await User.findOne({ phone: phone.trim() });
        
        // Si pas trouvé, essayer avec recherche régex insensible aux espaces
        if (!user) {
            console.log('   ❌ Pas trouvé avec phone exact, essai avec regex...');
            const phoneRegex = new RegExp(cleanPhone.replace(/\+/g, '\\+'));
            user = await User.findOne({ 
                phone: { $regex: phoneRegex, $options: 'i' } 
            });
        }

        if (!user) {
            console.log('   ❌ Utilisateur non trouvé');
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        console.log('   ✅ Utilisateur trouvé:', user.name);
        console.log('   Role:', user.role);

        // Vérifier que c'est un donneur
        if (user.role !== 'donor') {
            console.log('   ❌ Rôle incorrect (pas donor)');
            return res.status(403).json({ error: "Accès réservé aux donneurs" });
        }

        // Comparer le mot de passe
        console.log('   Password DB:', user.password ? user.password.substring(0, 10) + '...' : 'VIDE');
        
        // Vérifier si le password est hachéé (bcrypt commence par $2)
        const isHashed = user.password && user.password.startsWith('$2');
        console.log('   Password est hachéé:', isHashed);

        let passwordMatch = false;
        if (isHashed) {
            // Utiliser bcrypt pour les mots de passe hachés
            passwordMatch = await bcrypt.compare(password, user.password);
            console.log('   Comparaison bcrypt:', passwordMatch);
        } else {
            // Comparaison texte brut pour les données test
            passwordMatch = password === user.password;
            console.log('   Comparaison texte brut:', passwordMatch);
        }

        if (!passwordMatch) {
            console.log('   ❌ Mot de passe incorrect');
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        console.log('   ✅ Authentification réussie!\n');

        res.json({
            message: "Connexion réussie",
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                bloodGroup: user.bloodGroup,
                location: user.location,
                isAvailable: user.isAvailable,
                role: user.role
            }
        });

    } catch (err) {
        console.error('   ❌ Erreur serveur:', err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;