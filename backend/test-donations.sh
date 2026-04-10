#!/bin/bash

# Script de test pour l'API /api/donations
# Utilisation: bash test-donations.sh
# Ou: chmod +x test-donations.sh && ./test-donations.sh

set -e

API_URL="${API_URL:-http://localhost:5000}"
ENDPOINT="/api/donations"

echo "=================================================="
echo "   TEST DE L'API POST /api/donations"
echo "=================================================="
echo "URL: $API_URL$ENDPOINT"
echo "=================================================="
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour effectuer une requête et afficher le résultat
function test_request() {
  local test_name="$1"
  local method="$2"
  local url="$3"
  local data="$4"

  echo ""
  echo -e "${BLUE}🧪 TEST: $test_name${NC}"
  
  if [ -z "$data" ]; then
    # Requête GET
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
  else
    # Requête POST
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  # Séparer le corps de la réponse et le code HTTP
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  echo -e "Status Code: ${YELLOW}$http_code${NC}"
  echo "Response:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"

  # Vérifier le succès
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ Test réussi${NC}"
    return 0
  else
    echo -e "${RED}✗ Test échoué${NC}"
    return 1
  fi
}

# Récupérer les IDs des donneurs et hôpitaux
echo -e "${BLUE}📋 Récupération des donneurs et hôpitaux...${NC}\n"

donors_response=$(curl -s -X GET "$API_URL/api/donors")
donor_id=$(echo "$donors_response" | jq -r '.[0]._id' 2>/dev/null)
hospital_id=$(echo "$donors_response" | jq -r '.[] | select(.role=="hospital") | ._id' 2>/dev/null | head -1)

if [ -z "$donor_id" ] || [ "$donor_id" == "null" ]; then
  donor_id="507f1f77bcf86cd799439011"
  echo -e "${YELLOW}⚠️  Pas de donneur trouvé, utilisation d'un ID fictif${NC}"
else
  echo -e "${GREEN}✓ Donneur trouvé: $donor_id${NC}"
fi

if [ -z "$hospital_id" ] || [ "$hospital_id" == "null" ]; then
  hospital_id="507f1f77bcf86cd799439012"
  echo -e "${YELLOW}⚠️  Pas d'hôpital trouvé, utilisation d'un ID fictif${NC}"
else
  echo -e "${GREEN}✓ Hôpital trouvé: $hospital_id${NC}"
fi

echo ""
echo "=================================================="
echo ""

# Test 1: Donation valide
test_request \
  "Donation valide (450 ml, Normal)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"$donor_id\", \"hospitalId\": \"$hospital_id\", \"volume\": 450, \"healthNote\": \"Normal\"}"

# Test 2: Volume minimum
test_request \
  "Donation avec volume minimum (100 ml)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"$donor_id\", \"hospitalId\": \"$hospital_id\", \"volume\": 100, \"healthNote\": \"Fatigue\"}"

# Test 3: Volume maximum
test_request \
  "Donation avec volume maximum (1000 ml)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"$donor_id\", \"hospitalId\": \"$hospital_id\", \"volume\": 1000, \"healthNote\": \"Normal\"}"

# Test 4: Donneur invalide
test_request \
  "Donneur invalide (ID fictif)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"000000000000000000000000\", \"hospitalId\": \"$hospital_id\", \"volume\": 450, \"healthNote\": \"Normal\"}"

# Test 5: Hôpital invalide
test_request \
  "Hôpital invalide (ID fictif)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"$donor_id\", \"hospitalId\": \"000000000000000000000000\", \"volume\": 450, \"healthNote\": \"Normal\"}"

# Test 6: Champs manquants
test_request \
  "Champs manquants (sans hospitalId)" \
  "POST" \
  "$API_URL$ENDPOINT" \
  "{\"donorId\": \"$donor_id\", \"volume\": 450}"

# Test 7: Récupération de l'historique
test_request \
  "Récupérer l'historique des dons du donneur" \
  "GET" \
  "$API_URL$ENDPOINT/$donor_id" \
  ""

echo ""
echo "=================================================="
echo "   FIN DES TESTS"
echo "=================================================="
echo ""
echo "Pour des tests plus avancés, installez:"
echo "  - jq: sudo apt-get install jq"
echo "  - Postman: https://www.postman.com/downloads/"
echo ""
