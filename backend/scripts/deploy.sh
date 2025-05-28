#!/bin/bash

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Carica variabili d'ambiente
set -a
source ../.env
set +a

# Verifica variabili necessarie
if [ -z "$PLESK_HOST" ] || [ -z "$PLESK_USER" ] || [ -z "$PLESK_HTTPDOCS_PATH" ]; then
    echo -e "${RED}❌ Mancano le variabili d'ambiente necessarie per il deploy${NC}"
    echo "Assicurati di avere configurato:"
    echo "PLESK_HOST"
    echo "PLESK_USER"
    echo "PLESK_HTTPDOCS_PATH"
    exit 1
fi

echo -e "${YELLOW}🚀 Inizia il deploy su Plesk...${NC}"

# Build del progetto
echo -e "${YELLOW}📦 Build del progetto...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build completata con successo${NC}"
else
    echo -e "${RED}❌ Errore durante la build${NC}"
    exit 1
fi

# Creazione dell'archivio
echo -e "${YELLOW}📦 Creazione del pacchetto per il deploy...${NC}"
if tar czf app.tar.gz dist/ package.json package-lock.json; then
    echo -e "${GREEN}✅ Pacchetto creato con successo${NC}"
else
    echo -e "${RED}❌ Errore nella creazione del pacchetto${NC}"
    exit 1
fi

# Upload su Plesk
echo -e "${YELLOW}📤 Upload su Plesk...${NC}"
if scp app.tar.gz "$PLESK_USER@$PLESK_HOST:$PLESK_HTTPDOCS_PATH"; then
    echo -e "${GREEN}✅ Upload completato con successo${NC}"
else
    echo -e "${RED}❌ Errore durante l'upload${NC}"
    exit 1
fi

# Esecuzione comandi remoti
echo -e "${YELLOW}🔧 Configurazione sul server...${NC}"
ssh "$PLESK_USER@$PLESK_HOST" << 'ENDSSH'
    cd $PLESK_HTTPDOCS_PATH
    tar xzf app.tar.gz
    rm app.tar.gz
    npm install --production
    pm2 restart all || pm2 start dist/index.js
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deploy completato con successo${NC}"
else
    echo -e "${RED}❌ Errore durante la configurazione sul server${NC}"
    exit 1
fi

# Pulizia locale
rm app.tar.gz

echo -e "${GREEN}🎉 Deploy completato! L'applicazione è ora online.${NC}"