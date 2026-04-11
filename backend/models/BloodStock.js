const mongoose = require('mongoose');

const bloodStockSchema = new mongoose.Schema(
{
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    // Quantité en ml
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['out_of_stock', 'near_low', 'sufficient', 'good'],
        default: 'out_of_stock'
    },
    // Pour éviter le spam d'alertes automatiques
    lastAutoAlert: {
        type: Date,
        default: null
    }
},
{ timestamps: true }
);

// Un stock unique par hôpital et par groupe
bloodStockSchema.index({ hospitalId: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('BloodStock', bloodStockSchema);
