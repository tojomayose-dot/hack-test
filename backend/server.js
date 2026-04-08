require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONNEXION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🚀 BDD Connectée et prête !"))
    .catch(err => console.error("❌ Erreur Mongo:", err));

// LE SCHÉMA TRANSPARENT (Le secret !)
// On utilise 'strict: false' pour accepter N'IMPORTE QUEL champ demain
const DataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const DataModel = mongoose.model('Data', DataSchema);

// ROUTE GENERIQUE POUR RECUPERER
app.get('/api/items', async (req, res) => {
    const items = await DataModel.find();
    res.json(items);
});

// ROUTE GENERIQUE POUR AJOUTER
app.post('/api/items', async (req, res) => {
    const newItem = new DataModel(req.body); // Il prendra ce que Lili envoie
    await newItem.save();
    res.json(newItem);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));