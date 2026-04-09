const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
{
    // Hôpital qui crée l'alerte
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Groupe sanguin demandé
    bloodGroupNeeded: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },

    // Message personnalisé
    message: {
        type: String,
        trim: true
    },

    // Niveau d'urgence
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'high'
    },

    // Statut de l'envoi
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },

    // Nombre de donneurs contactés
    donorsNotified: {
        type: Number,
        default: 0
    }

},
{ timestamps: true }
);

// Index utiles
alertSchema.index({ hospitalId: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);