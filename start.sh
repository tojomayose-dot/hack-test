#!/bin/bash

# Script de démarrage complet pour Rakitra Ra
# Lance le backend MongoDB et le frontend Vite en parallèle

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║     🩸 RAKITRA RA - Système de Don de Sang       ║"
echo "║            Démarrage Complet                       ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Vérifier que les dossiers existent
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet (hack-test/)"
    exit 1
fi

# Vérifier que les .env existent
if [ ! -f "backend/.env" ]; then
    echo "❌ Erreur: backend/.env introuvable"
    exit 1
fi

echo "✓ Vérifications pré-démarrage OK"
echo ""

# Démarrer le backend en arrière-plan
echo "🔧 Démarrage du backend (port 5000)..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
sleep 3

# Démarrer le frontend en arrière-plan
echo "⚛️  Démarrage du frontend (port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║              ✅ DÉMARRAGE RÉUSSI                  ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "📱 Frontend  : http://localhost:5173"
echo "🔌 Backend   : http://localhost:5000"
echo "👤 Donneur   : http://localhost:5173/login-donneur"
echo ""
echo "📝 Logs:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "⏹️  Pour arrêter: Appuyez sur Ctrl+C"
echo ""

# Garder les processus actifs
wait
