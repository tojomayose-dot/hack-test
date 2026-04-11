const mongoose = require("mongoose");

// Table séparée pour stocker les donneurs ayant activé leur profil public.
// Quand un donneur active la visibilité, son ID est ajouté ici.
// Quand il la désactive, l'entrée est supprimée.
const publicProfileSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PublicProfile", publicProfileSchema);
