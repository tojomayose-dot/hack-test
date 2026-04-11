const express = require('express');
const router = express.Router();
const BloodStock = require('../models/BloodStock');
const User = require('../models/User');
const Alert = require('../models/Alert');
const mongoose = require('mongoose');

// Matrice de compatibilité sanguine (Qui peut donner à qui)
const COMPATIBILITY_MATRIX = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
};

// GET /api/stock/:hospitalId — Récupérer l'état des stocks d'un hôpital
router.get('/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // S'assurer que les 8 groupes existent pour cet hôpital (initialisation si besoin)
        const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        let stocks = await BloodStock.find({ hospitalId });

        if (stocks.length < 8) {
            const existingGroups = stocks.map(s => s.bloodGroup);
            const missingGroups = groups.filter(g => !existingGroups.includes(g));
            
            if (missingGroups.length > 0) {
                const newStocks = missingGroups.map(group => ({
                    hospitalId,
                    bloodGroup: group,
                    quantity: 500, // Initialisation par défaut
                    status: 'near_low'
                }));
                await BloodStock.insertMany(newStocks);
                stocks = await BloodStock.find({ hospitalId });
            }
        }

        res.json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/stock/update — Mettre à jour un stock et déclencher l'alerte auto si besoin
router.patch('/update', async (req, res) => {
    try {
        const { hospitalId, bloodGroup, quantity } = req.body;

        if (!hospitalId || !bloodGroup || quantity === undefined) {
            return res.status(400).json({ error: "Données manquantes" });
        }

        let status = 'good';
        if (quantity === 0) status = 'out_of_stock';
        else if (quantity < 500) status = 'near_low';
        else if (quantity < 2000) status = 'sufficient';

        const stock = await BloodStock.findOneAndUpdate(
            { hospitalId, bloodGroup },
            { quantity, status },
            { new: true, upsert: true }
        );

        // LOGIQUE D'ALERTE AUTOMATIQUE
        if (quantity === 0) {
            // Vérifier si une alerte auto a déjà été envoyée récemment (ex: dernière heure)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (!stock.lastAutoAlert || stock.lastAutoAlert < oneHourAgo) {
                
                const hospital = await User.findById(hospitalId);
                const compatibleGroups = COMPATIBILITY_MATRIX[bloodGroup] || [bloodGroup];
                
                // Trouver les donneurs disponibles des groupes compatibles
                const donors = await User.find({
                    role: 'donor',
                    bloodGroup: { $in: compatibleGroups },
                    isAvailable: true
                });

                if (donors.length > 0) {
                    const messageAuto = `🚨 ALERTE AUTOMATIQUE : Le stock de ${bloodGroup} est épuisé à ${hospital.name || 'votre hôpital'}. Votre aide est requise immédiatement.`;
                    
                    const newAlert = new Alert({
                        hospitalId,
                        bloodGroupNeeded: bloodGroup,
                        message: messageAuto,
                        urgencyLevel: 'critical',
                        status: 'sent',
                        donorsNotified: donors.length
                    });
                    
                    await newAlert.save();
                    
                    // Mettre à jour la date de dernière alerte auto
                    stock.lastAutoAlert = new Date();
                    await stock.save();

                    console.log(`[AUTO-ALERT] ${donors.length} donneurs notifiés pour rupture de stock ${bloodGroup}`);
                    return res.json({ stock, autoAlertSent: true, notifiedCount: donors.length });
                }
            }
        }

        res.json({ stock, autoAlertSent: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
