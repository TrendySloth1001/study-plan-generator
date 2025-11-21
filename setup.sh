#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Study Plan Generator - Setup Script  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    echo -e "Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}Setup cancelled. Keeping existing .env file.${NC}"
        exit 0
    fi
fi

# Copy example file
echo -e "${BLUE}📝 Creating .env file...${NC}"
cp .env.example .env

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ .env file created successfully!${NC}"
else
    echo -e "${RED}❌ Failed to create .env file${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You need to add your API key!${NC}"
echo ""
echo -e "Steps to complete setup:"
echo -e "1. Get your API key from: ${BLUE}https://ai.google.dev/${NC}"
echo -e "2. Open the ${GREEN}.env${NC} file in your editor"
echo -e "3. Replace ${RED}your_api_key_here${NC} with your actual API key"
echo ""
echo -e "${YELLOW}⚠️  NEVER commit the .env file to git!${NC}"
echo ""
echo -e "${BLUE}For detailed instructions, see: URGENT_API_KEY_FIX.md${NC}"
echo ""
echo -e "${GREEN}Setup complete!${NC} Run ${BLUE}npm run dev${NC} after adding your API key."
