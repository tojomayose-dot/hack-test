/**
 * seed-data.js
 * Script pour insérer des données de test dans MongoDB
 * Utilisation: node seed-data.js
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const Donation = require('./models/Donation');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blood-donation');
    console.log('✓ Connexion à MongoDB réussie');
  } catch (err) {
    console.error('✗ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Nettoyer les collections
    await User.deleteMany({});
    await Donation.deleteMany({});
    console.log('✓ Collections vidées');

    // Créer des donneurs
    const donors = await User.insertMany([
      {
        phone: '+261341234567',
        password: 'password123', // À hasher en production
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        role: 'donor',
        location: 'Ankatso, Antananarivo',
        bloodGroup: 'O+',
        isAvailable: true,
        language: 'fr'
      },
      {
        phone: '+261341234568',
        password: 'password123',
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        role: 'donor',
        location: 'Tsimihety, Antananarivo',
        bloodGroup: 'A+',
        isAvailable: true,
        language: 'fr'
      },
      {
        phone: '+261341234569',
        password: 'password123',
        name: 'Pierre Bernard',
        email: 'pierre.bernard@email.com',
        role: 'donor',
        location: 'Analakely, Antananarivo',
        bloodGroup: 'B-',
        isAvailable: false,
        language: 'fr'
      },
      {
        phone: '+261341234570',
        password: 'password123',
        name: 'Sophie Leblanc',
        email: 'sophie.leblanc@email.com',
        role: 'donor',
        location: 'Anosy, Antananarivo',
        bloodGroup: 'AB+',
        isAvailable: true,
        language: 'mg'
      }
    ]);

    console.log(`✓ ${donors.length} donneur(s) créé(s)`);

    // Créer des hôpitaux
    const hospitals = await User.insertMany([
      {
        phone: '+261201234567',
        password: 'password123',
        name: 'Hôpital Central',
        email: 'contact@hopital-central.mg',
        role: 'hospital',
        location: 'Antananarivo',
        hospitalName: 'Hôpital Central d\'Antananarivo',
        language: 'fr'
      },
      {
        phone: '+261201234568',
        password: 'password123',
        name: 'Centre Médical Universitaire',
        email: 'contact@cmu.mg',
        role: 'hospital',
        location: 'Analakely, Antananarivo',
        hospitalName: 'Centre Médical Universitaire',
        language: 'fr'
      },
      {
        phone: '+261201234569',
        password: 'password123',
        name: 'Hôpital de la Croix-Rouge',
        email: 'contact@croix-rouge.mg',
        role: 'hospital',
        location: 'Toliara',
        hospitalName: 'Hôpital de la Croix-Rouge - Toliara',
        language: 'fr'
      }
    ]);

    console.log(`✓ ${hospitals.length} hôpital(aux) créé(s)`);

    // Créer des dons d'exemple
    const donations = await Donation.insertMany([
      {
        donorId: donors[0]._id,
        hospitalId: hospitals[0]._id,
        amount: 450,
        healthNote: 'Normal',
        status: 'completed',
        donationDate: new Date('2026-04-08')
      },
      {
        donorId: donors[1]._id,
        hospitalId: hospitals[1]._id,
        amount: 400,
        healthNote: 'Fatigue',
        status: 'completed',
        donationDate: new Date('2026-04-09')
      },
      {
        donorId: donors[0]._id,
        hospitalId: hospitals[2]._id,
        amount: 500,
        healthNote: 'Normal',
        status: 'pending',
        donationDate: new Date('2026-04-10')
      },
      {
        donorId: donors[3]._id,
        hospitalId: hospitals[0]._id,
        amount: 350,
        healthNote: 'Tension Basse',
        status: 'completed',
        donationDate: new Date('2026-04-07')
      }
    ]);

    console.log(`✓ ${donations.length} don(s) créé(s)`);

    console.log('\n' + '='.repeat(60));
    console.log('DONNÉES DE SEED INSÉRÉES AVEC SUCCÈS');
    console.log('='.repeat(60));
    console.log('\nDONNEURS:');
    donors.forEach(donor => {
      console.log(`  • ${donor.name} (${donor.bloodGroup}) - ${donor._id}`);
    });

    console.log('\nHÔPITAUX:');
    hospitals.forEach(hospital => {
      console.log(`  • ${hospital.hospitalName} - ${hospital._id}`);
    });

    console.log('\nDONS:');
    donations.forEach((donation, idx) => {
      const donor = donors.find(d => d._id.equals(donation.donorId));
      const hospital = hospitals.find(h => h._id.equals(donation.hospitalId));
      console.log(`  ${idx + 1}. ${donor.name} → ${hospital.hospitalName} (${donation.volume}ml)`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('Vous pouvez maintenant utiliser ces IDs dans vos tests');
    console.log('='.repeat(60) + '\n');

  } catch (err) {
    console.error('✗ Erreur lors de l\'insertion:', err);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Connexion MongoDB fermée');
  }
};

if (require.main === module) {
  connectDB().then(() => seedData());
}

module.exports = { connectDB, seedData };
