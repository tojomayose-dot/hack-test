// backend/controllers/donorController.js
const User = require('../models/User');

exports.searchDonors = async (req, res) => {
    try {
        const { bloodGroup } = req.query; // Récupère le ?bloodGroup=...
        
        // On cherche les utilisateurs qui ont le rôle 'donor' (ou 'hospital' selon ton test)
        // et qui correspondent au groupe sanguin s'il est précisé
        let filter = { role: 'donor' }; 
        if (bloodGroup) {
            filter.bloodGroup = bloodGroup;
        }

        const donors = await User.find(filter);
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la recherche", error });
    }
};