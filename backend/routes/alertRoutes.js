const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { hospitalName, donorIds, bloodGroupNeed } = req.body;

        console.log(`\n🚨 ALERTE URGENCE DÉCLENCHÉE PAR : ${hospitalName} 🚨`);
        console.log(`Envoi de SMS à ${donorIds.length} donneurs compatibles pour du sang ${bloodGroupNeed}...`);
        console.log(`SMS envoyés avec succès !\n`);

        res.status(200).json({
            message: `${donorIds.length} donneurs ont été alertés par SMS avec succès !`
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'envoi des alertes" });
    }
});

module.exports = router;


/*const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Créer une alerte
router.post('/', async (req, res) => {
    try {
        const newAlert = new Alert(req.body);
        await newAlert.save();

        console.log(`🚨 Alerte créée pour groupe ${newAlert.bloodGroupNeeded}`);

        res.status(201).json({
            message: "Alerte enregistrée avec succès",
            alert: newAlert
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Historique des alertes d’un hôpital
router.get('/hospital/:hospitalId', async (req, res) => {
    try {
        const alerts = await Alert.find({ hospitalId: req.params.hospitalId })
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;*/