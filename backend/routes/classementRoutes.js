// backend/routes/classementRoutes.js
const express = require('express');
const router = express.Router();
const { getClassement, toggleConfidentialite, checkConfidentialite } = require('../controllers/classementController');

// GET /api/classement — Récupérer le classement public
router.get('/', getClassement);

// GET /api/classement/confidentialite/:donorId — Vérifier si le profil est public
router.get('/confidentialite/:donorId', checkConfidentialite);

// PATCH /api/classement/confidentialite — Basculer la visibilité du profil
router.patch('/confidentialite', toggleConfidentialite);

module.exports = router;
