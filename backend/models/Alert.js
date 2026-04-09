const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  hospitalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  bloodGroupNeeded: { 
    type: String, 
    required: true 
  },

  message: { 
    type: String 
  },

  status: { 
    type: String, 
    enum: ['sent', 'pending', 'failed'],
    default: 'sent' 
  }

}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);