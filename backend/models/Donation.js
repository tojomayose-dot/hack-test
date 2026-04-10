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

  // Date du don
  donationDate: {
    type: Date,
    required: true
  },

  // Note de santé (champ texte libre)
  healthNote: {
    type: String,
    required: true
  },

  // Quantité donnée (en ml)
  amount: {
    type: Number,
    default: 450,
    required: true
  },

  // Statut du don
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);