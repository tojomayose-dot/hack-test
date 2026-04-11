const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const PublicProfile = require('../models/PublicProfile');

// Calcul dynamique du titre de niveau (non stocké en base)
const getTitreNiveau = (nombre_dons) => {
    if (nombre_dons >= 20) return { emoji: '🏆', titre: 'Le Héros' };
    if (nombre_dons >= 10) return { emoji: '🔥', titre: 'Le Phénix' };
    if (nombre_dons >= 5)  return { emoji: '🏛️', titre: 'Le Pilier' };
    if (nombre_dons >= 3)  return { emoji: '🛡️', titre: 'Le Gardien' };
    if (nombre_dons >= 1)  return { emoji: '🌱', titre: "L'Éveilleur" };
    return { emoji: '🆕', titre: 'Newbie' };
};

// GET /api/classement — Classement public des héros
exports.getClassement = async (req, res) => {
    try {
        // Récupérer les IDs des donneurs ayant activé leur profil public
        const profilsPublics = await PublicProfile.find({}).lean();
        const publicDonorIds = profilsPublics.map(p => p.donorId);

        if (publicDonorIds.length === 0) {
            return res.json([]);
        }

        // Récupérer les infos des donneurs publics
        const donneursPublics = await User.find(
            { _id: { $in: publicDonorIds }, role: 'donor' },
            'name bloodGroup location'
        ).lean();

        if (donneursPublics.length === 0) {
            return res.json([]);
        }

        // Compter les dons de chaque donneur public en une seule requête agrégée
        // Importante : cast manuel en ObjectId pour le $match dans aggregate
        const donorObjectIds = donneursPublics.map(d => new mongoose.Types.ObjectId(String(d._id)));
        const compteurDons = await Donation.aggregate([
            { $match: { donorId: { $in: donorObjectIds }, status: 'completed' } },
            { $group: { _id: '$donorId', nombre_dons: { $sum: 1 } } }
        ]);

        // Mapper les compteurs par ID pour accès rapide
        const donsParDonneur = {};
        compteurDons.forEach(c => {
            donsParDonneur[c._id.toString()] = c.nombre_dons;
        });

        // Construire le classement avec titre dynamique
        const classement = donneursPublics.map(donneur => {
            const nombre_dons = donsParDonneur[donneur._id.toString()] || 0;
            const { emoji, titre } = getTitreNiveau(nombre_dons);
            return {
                _id: donneur._id,
                nom: donneur.name,
                groupe_sanguin: donneur.bloodGroup,
                localisation: donneur.location,
                nombre_dons,
                emoji,
                titre
            };
        });

        // Tri décroissant par nombre de dons
        classement.sort((a, b) => b.nombre_dons - a.nombre_dons);

        // Ajouter le rang
        classement.forEach((entry, index) => {
            entry.rang = index + 1;
        });

        res.json(classement);
    } catch (error) {
        console.error('Erreur classement:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du classement', error: error.message });
    }
};

// PATCH /api/classement/confidentialite — Basculer la visibilité du profil
exports.toggleConfidentialite = async (req, res) => {
    try {
        const { donorId } = req.body;

        if (!donorId) {
            return res.status(400).json({ message: 'donorId requis' });
        }

        // Vérifier que le donneur existe
        const donneur = await User.findById(donorId);
        if (!donneur || donneur.role !== 'donor') {
            return res.status(404).json({ message: 'Donneur non trouvé' });
        }

        // Vérifier si le donneur a déjà un profil public
        const profilExistant = await PublicProfile.findOne({ donorId });

        if (profilExistant) {
            // Il est public → le rendre privé (supprimer l'entrée)
            await PublicProfile.deleteOne({ donorId });
            res.json({
                message: 'Votre profil est désormais privé.',
                est_public: false
            });
        } else {
            // Il est privé → le rendre public (créer l'entrée)
            await PublicProfile.create({ donorId });
            res.json({
                message: 'Votre profil est maintenant visible dans le classement.',
                est_public: true
            });
        }
    } catch (error) {
        console.error('Erreur confidentialité:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
};

// GET /api/classement/confidentialite/:donorId — Vérifier si le profil est public
exports.checkConfidentialite = async (req, res) => {
    try {
        const { donorId } = req.params;

        if (!donorId) {
            return res.status(400).json({ message: 'donorId requis' });
        }

        const profilPublic = await PublicProfile.findOne({ donorId });

        res.json({
            est_public: !!profilPublic
        });
    } catch (error) {
        console.error('Erreur vérification confidentialité:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification', error: error.message });
    }
};
