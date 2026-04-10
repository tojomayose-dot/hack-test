const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
    // roles = tableau ou chaîne
    if (typeof roles === 'string') roles = [roles];

    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: "Token manquant" });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);
            if (!user) return res.status(401).json({ error: "Utilisateur introuvable" });

            // Vérification rôle si défini
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ error: "Accès refusé" });
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ error: "Token invalide ou expiré" });
        }
    };
};

module.exports = auth;