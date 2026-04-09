const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroupNeeded: { type: String, required: true }, // [cite: 11]
  message: { type: String }, // [cite: 12]
  status: { type: String, default: 'sent' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);