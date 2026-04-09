const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
{
    // Donneur
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Hôpital receveur
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Date du don
    donationDate: {
        type: Date,
        default: Date.now
    },

    // État du donneur après don
    healthNote: {
        type: String,
        enum: ['Normal', 'Fatigue', 'Tension Basse', 'Autre'],
        default: 'Normal'
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
        enum: ['completed', 'pending', 'cancelled'],
        default: 'completed'
    }

},
{ timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);