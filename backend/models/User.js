const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // LE NUMÉRO DE TÉLÉPHONE DEVIENT L'IDENTIFIANT PRINCIPAL
  phone: { 
    type: String, 
    required: true, 
    unique: true, // Empêche deux comptes avec le même numéro
    trim: true 
  },
  password: { type: String, required: true },
  
  // L'EMAIL DEVIENT OPTIONNEL
  email: { 
    type: String, 
    required: false, // Plus obligatoire
    unique: false, 
    sparse: true // Permet d'avoir plusieurs 'null' sans conflit d'index unique
  },
  
  role: { 
    type: String, 
    enum: ['donor', 'hospital'], 
    required: true 
  }, // [cite: 10, 23]
  
  location: { type: String, required: true }, // [cite: 10, 19]
  
  // Spécifique au Donneur
  bloodGroup: { type: String }, // [cite: 10, 11]
  isAvailable: { type: Boolean, default: true }, // [cite: 13]
  
  // Spécifique à l'Hôpital
  hospitalName: { type: String },
  
  // Langue préférée pour l'interface et les SMS
  language: { type: String, enum: ['fr', 'mg'], default: 'fr' } // [cite: 15, 19]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);