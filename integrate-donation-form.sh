#!/bin/bash

# Integration helper script
# This script automates the integration of DonationForm into your app
# Usage: bash integrate-donation-form.sh

set -e

echo "=================================================="
echo "   DONATION FORM - SETUP HELPER"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "frontend/src/App.jsx" ]; then
    echo -e "${YELLOW}⚠️  Error: App.jsx not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Checking dependencies...${NC}\n"

# Check if lucide-react is installed
if grep -q "lucide-react" frontend/package.json; then
    echo -e "${GREEN}✓ lucide-react is already installed${NC}"
else
    echo -e "${YELLOW}⚠️  lucide-react not found, installing...${NC}"
    cd frontend
    npm install lucide-react
    cd ..
    echo -e "${GREEN}✓ lucide-react installed${NC}"
fi

# Check if axios is installed
if grep -q "axios" frontend/package.json; then
    echo -e "${GREEN}✓ axios is already installed${NC}"
else
    echo -e "${YELLOW}⚠️  axios not found, installing...${NC}"
    cd frontend
    npm install axios
    cd ..
    echo -e "${GREEN}✓ axios installed${NC}"
fi

echo ""
echo -e "${BLUE}📁 Step 2: Creating directory structure...${NC}\n"

# Create DonationForm directory
mkdir -p frontend/src/pages/DonationForm
echo -e "${GREEN}✓ DonationForm directory created${NC}"

echo ""
echo -e "${BLUE}📄 Step 3: Verifying files...${NC}\n"

# Check if files exist
if [ -f "frontend/src/pages/DonationForm/DonationForm.jsx" ]; then
    echo -e "${GREEN}✓ DonationForm.jsx found${NC}"
else
    echo -e "${YELLOW}⚠️  DonationForm.jsx not found!${NC}"
fi

if [ -f "frontend/src/pages/DonationForm/DonationForm.css" ]; then
    echo -e "${GREEN}✓ DonationForm.css found${NC}"
else
    echo -e "${YELLOW}⚠️  DonationForm.css not found!${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Step 4: Checking App.jsx integration...${NC}\n"

# Check if DonationForm is already imported
if grep -q "DonationForm" frontend/src/App.jsx; then
    echo -e "${GREEN}✓ DonationForm is already integrated in App.jsx${NC}"
else
    echo -e "${YELLOW}⚠️  DonationForm not found in App.jsx${NC}"
    echo ""
    echo "To integrate, add these lines to frontend/src/App.jsx:"
    echo ""
    echo -e "${YELLOW}// Add this import:${NC}"
    echo "import DonationForm from './pages/DonationForm/DonationForm';"
    echo ""
    echo -e "${YELLOW}// Add this route:${NC}"
    echo "<Route path=\"/donate\" element={<DonationForm />} />"
    echo ""
fi

echo ""
echo -e "${BLUE}📊 Step 5: Backend setup...${NC}\n"

if [ -f "backend/seed-data.js" ]; then
    echo -e "${GREEN}✓ seed-data.js found${NC}"
    echo ""
    echo "To insert test data, run:"
    echo -e "${YELLOW}cd backend && node seed-data.js${NC}"
else
    echo -e "${YELLOW}⚠️  seed-data.js not found!${NC}"
fi

echo ""
echo -e "${BLUE}🧪 Step 6: Testing setup...${NC}\n"

if [ -f "backend/test-donations.js" ]; then
    echo -e "${GREEN}✓ test-donations.js found${NC}"
    echo ""
    echo "To run API tests, execute:"
    echo -e "${YELLOW}cd backend && node test-donations.js${NC}"
else
    echo -e "${YELLOW}⚠️  test-donations.js not found!${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}   SETUP COMPLETE!${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Add the import and route to frontend/src/App.jsx (see above)"
echo "2. Insert test data:"
echo "   ${YELLOW}cd backend && node seed-data.js${NC}"
echo ""
echo "3. Start the servers:"
echo "   Terminal 1: ${YELLOW}cd backend && node server.js${NC}"
echo "   Terminal 2: ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "4. Visit: ${YELLOW}http://localhost:5173/donate${NC}"
echo ""
echo "5. Test the API:"
echo "   ${YELLOW}cd backend && node test-donations.js${NC}"
echo ""
echo "📚 Documentation:"
echo "   • QUICK_START.md - Quick start guide"
echo "   • INSTALLATION_GUIDE.md - Detailed installation"
echo "   • TESTING_GUIDE.md - Testing guide"
echo "   • DONATION_GUIDE.md - Complete documentation"
echo ""
echo -e "${GREEN}Happy coding! ❤️${NC}"
echo ""
