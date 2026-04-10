#!/usr/bin/env node

/**
 * Script de diagnostic MongoDB Atlas pour Rakitra Ra
 * Aide à identifier les problèmes de connexion
 * 
 * Usage: node diagnose-mongodb.js
 */

const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

console.log('\n🔍 DIAGNOSTIC MONGODB ATLAS - RAKITRA RA');
console.log('═'.repeat(50));

// 1. Vérifier le fichier .env
console.log('\n1️⃣ Vérification du fichier .env:');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('   ✅ Fichier .env trouvé');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const mongoUri = envContent.match(/MONGO_URI=(.*)/)?.[1];
    if (mongoUri) {
        console.log('   ✅ MONGO_URI défini');
        console.log('   📌 URI (password masqué):', mongoUri.replace(/:[^:]*@/, ':****@'));
        
        // Vérifier le format
        if (mongoUri.includes('mongodb+srv://')) {
            console.log('   ✅ Format SRV correct (atlas)');
        } else {
            console.log('   ⚠️ Format non-SRV détecté (local?)');
        }
        
        // Extraire le cluster
        const clusterMatch = mongoUri.match(/@([\w-]+)\.mongodb\.net/);
        if (clusterMatch) {
            console.log('   📍 Cluster:', clusterMatch[1]);
        }
        
        // Vérifier la base de données
        const dbMatch = mongoUri.match(/mongodb\.net\/([\w-]+)\?/);
        if (dbMatch) {
            console.log('   📦 Base de données:', dbMatch[1]);
        }
    } else {
        console.log('   ❌ MONGO_URI non trouvé dans .env');
    }
} else {
    console.log('   ❌ Fichier .env NON trouvé à:', envPath);
}

// 2. Vérifier la connectivité internet
console.log('\n2️⃣ Vérification de la connectivité:');
dns.resolve('cluster0.p36bs3l.mongodb.net')
    .then((addresses) => {
        console.log('   ✅ Résolution DNS MongoDB OK');
        console.log('   📍 IPs résolues:', addresses.slice(0, 2).join(', '));
    })
    .catch((err) => {
        console.log('   ⚠️ Résolution DNS échouée:', err.code);
        console.log('   ❌ Vous n\'avez peut-être pas accès à Internet');
    })
    .finally(() => {
        // 3. Résumé des actions
        console.log('\n3️⃣ Actions recommandées:');
        console.log('   • Vérifiez votre adresse IP actuelle:');
        console.log('     → https://www.whatismyipaddress.com/');
        console.log('   • Allez sur MongoDB Atlas Network Access:');
        console.log('     → https://cloud.mongodb.com/');
        console.log('     → Security → Network Access');
        console.log('   • Ajoutez votre IP ou utilisez 0.0.0.0/0');
        console.log('   • Redémarrez le backend: node server.js');
        console.log('\n✨ Pour plus de détails, consultez MONGODB_SETUP_GUIDE.md');
        console.log('═'.repeat(50) + '\n');
    });
