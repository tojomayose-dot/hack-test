const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Référence vers le donneur (lié à la table User)
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Référence vers l'hôpital où le don a été fait
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Date du don (par défaut aujourd'hui)
  date: { 
    type: Date, 
    default: Date.now 
  },
  
  // Bilan de santé après le don 
  healthNote: { 
    type: String, 
    enum: ['Normal', 'Fatigue', 'Tension Basse', 'Autre'],
    default: 'Normal'
  },
  
  // Volume donné (optionnel, en ml)
  volume: { 
    type: Number, 
    default: 450 
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);