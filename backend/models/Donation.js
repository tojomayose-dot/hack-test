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

    // Volume en ml
    volume: {
        type: Number,
        default: 450,
        min: 100,
        max: 1000
    },

  // Statut du don
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);