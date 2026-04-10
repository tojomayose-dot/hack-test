/**
 * Script de test pour l'API POST /api/donations
 * Utilisation: node test-donations.js
 * 
 * Ce script teste la route POST /api/donations avec des données réalistes
 * et affiche les résultats dans le terminal.
 */

const http = require('http');
const https = require('https');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';
const ENDPOINT = '/api/donations';

/**
 * Effectue une requête HTTP/HTTPS
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE_URL + path);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DonationAPI-TestScript/1.0'
      }
    };

    if (data && method !== 'GET') {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = protocol.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        }
      });
    });

    req.on('error', reject);

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Affiche les résultats de test formatés
 */
function printResult(testName, response, success = false) {
  const icon = success ? '✓' : '✗';
  const color = success ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`\n${color}${icon}${reset} ${testName}`);
  console.log(`  Status: ${response.status}`);
  console.log(`  Response:`, JSON.stringify(response.body, null, 2));
}

/**
 * Récupère les donneurs et hôpitaux pour les utiliser dans les tests
 */
async function fetchUsersData() {
  try {
    console.log('\n📋 Récupération des donneurs et hôpitaux...\n');

    const response = await makeRequest('GET', '/api/donors');

    if (response.status === 200 && response.body.length > 0) {
      const donors = response.body.filter(u => u.role === 'donor');
      const hospitals = response.body.filter(u => u.role === 'hospital');

      console.log(`  ✓ ${donors.length} donneur(s) trouvé(s)`);
      console.log(`  ✓ ${hospitals.length} hôpital(aux) trouvé(s)`);

      if (donors.length > 0) {
        console.log(`\n  Exemple donneur: ${donors[0].name} (${donors[0]._id})`);
      }
      if (hospitals.length > 0) {
        console.log(`  Exemple hôpital: ${hospitals[0].hospitalName} (${hospitals[0]._id})`);
      }

      return { donors, hospitals };
    } else {
      console.warn('⚠️  Aucun utilisateur trouvé. Utilisation d\'IDs fictifs pour les tests.');
      return { donors: [], hospitals: [] };
    }
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', err.message);
    return { donors: [], hospitals: [] };
  }
}

/**
 * Programme principal de test
 */
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('   TEST DE L\'API POST /api/donations');
  console.log('='.repeat(60));
  console.log(`URL: ${API_BASE_URL}${ENDPOINT}`);
  console.log('='.repeat(60));

  const { donors, hospitals } = await fetchUsersData();

  // Préparation des données de test
  const donorId = donors.length > 0 ? donors[0]._id : '507f1f77bcf86cd799439011';
  const hospitalId = hospitals.length > 0 ? hospitals[0]._id : '507f1f77bcf86cd799439012';

  // Test 1: Donation valide
  const validDonationData = {
    donorId: donorId,
    hospitalId: hospitalId,
    volume: 450,
    healthNote: 'Normal'
  };

  console.log('\n\n🧪 TEST 1: Donation valide');
  console.log('Données:', JSON.stringify(validDonationData, null, 2));

  try {
    const response = await makeRequest('POST', ENDPOINT, validDonationData);
    const success = response.status === 201;
    printResult('Créer une donation valide', response, success);

    if (success && response.body._id) {
      console.log(`\n  ✓ ID du don créé: ${response.body._id}`);
    }
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 2: Volume faible (100 ml)
  console.log('\n\n🧪 TEST 2: Donation avec volume minimum (100 ml)');
  const lowVolumeDonation = {
    donorId: donorId,
    hospitalId: hospitalId,
    volume: 100,
    healthNote: 'Fatigue'
  };

  try {
    const response = await makeRequest('POST', ENDPOINT, lowVolumeDonation);
    const success = response.status === 201;
    printResult('Donner 100 ml', response, success);
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 3: Volume élevé (1000 ml)
  console.log('\n\n🧪 TEST 3: Donation avec volume maximum (1000 ml)');
  const highVolumeDonation = {
    donorId: donorId,
    hospitalId: hospitalId,
    volume: 1000,
    healthNote: 'Normal'
  };

  try {
    const response = await makeRequest('POST', ENDPOINT, highVolumeDonation);
    const success = response.status === 201;
    printResult('Donner 1000 ml', response, success);
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 4: Donneur invalide
  console.log('\n\n🧪 TEST 4: Donneur invalide (ID inexistant)');
  const invalidDonorData = {
    donorId: '000000000000000000000000',
    hospitalId: hospitalId,
    volume: 450,
    healthNote: 'Normal'
  };

  try {
    const response = await makeRequest('POST', ENDPOINT, invalidDonorData);
    const shouldFail = response.status >= 400;
    printResult('Rejeter donation avec donneur invalide', response, shouldFail);
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 5: Hôpital invalide
  console.log('\n\n🧪 TEST 5: Hôpital invalide (ID inexistant)');
  const invalidHospitalData = {
    donorId: donorId,
    hospitalId: '000000000000000000000000',
    volume: 450,
    healthNote: 'Normal'
  };

  try {
    const response = await makeRequest('POST', ENDPOINT, invalidHospitalData);
    const shouldFail = response.status >= 400;
    printResult('Rejeter donation avec hôpital invalide', response, shouldFail);
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 6: Champs manquants
  console.log('\n\n🧪 TEST 6: Champs manquants');
  const incompleteData = {
    donorId: donorId
    // hospitalId manquant
  };

  try {
    const response = await makeRequest('POST', ENDPOINT, incompleteData);
    const shouldFail = response.status >= 400;
    printResult('Rejeter donation incomplète', response, shouldFail);
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  // Test 7: Récupération de l'historique
  console.log('\n\n🧪 TEST 7: Récupération de l\'historique des dons');
  try {
    const response = await makeRequest('GET', `${ENDPOINT}/${donorId}`);
    const success = response.status === 200 && Array.isArray(response.body);
    printResult(`Récupérer historique du donneur`, response, success);

    if (success) {
      console.log(`  ✓ ${response.body.length} don(s) trouvé(s) pour ce donneur`);
    }
  } catch (err) {
    console.error(`  ❌ Erreur: ${err.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('   FIN DES TESTS');
  console.log('='.repeat(60) + '\n');
}

// Exécution
if (require.main === module) {
  runTests().catch(err => {
    console.error('Erreur fatale:', err);
    process.exit(1);
  });
}

module.exports = { makeRequest, fetchUsersData };
