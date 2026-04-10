const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    // Identifiant principal
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    // Nom (important pour donneur ET hôpital)
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        sparse: true,
        trim: true,
    },

    role: {
        type: String,
        enum: ["donor", "hospital"],
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    // Spécifique DONNEUR
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: function () {
            return this.role === "donor";
        },
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    // Spécifique HÔPITAL
    hospitalName: {
        type: String,
        required: function () {
            return this.role === "hospital";
        },
    },

    // Langue
    language: {
        type: String,
        enum: ["fr", "mg"],
        default: "fr",
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);