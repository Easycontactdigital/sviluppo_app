# Backend - Gestione Budget Familiare

Backend per l'applicazione di gestione budget familiare sviluppato con Node.js, Express, TypeScript e Drizzle ORM.

## Requisiti

- Node.js >= 18.16.0
- PostgreSQL >= 14
- Firebase project configurato

## Setup

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Copia il file `.env.example` in `.env` e configura le variabili d'ambiente:
   ```bash
   cp ../.env.example .env
   ```

3. Configura le seguenti variabili nel file `.env`:
   - Database PostgreSQL:
     ```
     POSTGRES_HOST=
     POSTGRES_PORT=
     POSTGRES_DB=
     POSTGRES_USER=
     POSTGRES_PASSWORD=
     ```
   - Firebase:
     ```
     FIREBASE_API_KEY=
     FIREBASE_AUTH_DOMAIN=
     FIREBASE_PROJECT_ID=
     ```

4. Esegui le migrazioni del database:
   ```bash
   npm run migrate
   ```

## Sviluppo

1. Avvia il server in modalità sviluppo:
   ```bash
   npm run dev
   ```

2. Il server sarà disponibile su `http://localhost:3001`

## API Endpoints

### Autenticazione
Tutte le richieste API (eccetto /health) richiedono un token JWT valido nell'header:
```
Authorization: Bearer <token>
```

### Endpoints disponibili

#### Health Check
- `GET /api/health` - Verifica lo stato del server

#### Transazioni
- `POST /api/transactions` - Crea una nuova transazione
- `GET /api/transactions` - Lista tutte le transazioni
- `GET /api/transactions/:id` - Dettagli di una transazione
- `PUT /api/transactions/:id` - Aggiorna una transazione
- `DELETE /api/transactions/:id` - Elimina una transazione

#### Contratti
- `POST /api/contracts` - Crea un nuovo contratto
- `GET /api/contracts` - Lista tutti i contratti
- `GET /api/contracts/:id` - Dettagli di un contratto
- `PUT /api/contracts/:id` - Aggiorna un contratto
- `DELETE /api/contracts/:id` - Elimina un contratto
- `POST /api/contracts/update-by-practice-code` - Aggiorna contratto tramite codice pratica

#### Obiettivi di Risparmio
- `POST /api/savings-goals` - Crea un nuovo obiettivo
- `GET /api/savings-goals` - Lista tutti gli obiettivi
- `GET /api/savings-goals/:id` - Dettagli di un obiettivo
- `PUT /api/savings-goals/:id` - Aggiorna un obiettivo
- `DELETE /api/savings-goals/:id` - Elimina un obiettivo
- `POST /api/savings-goals/:id/progress` - Aggiorna il progresso

#### Notifiche
- `POST /api/notifications` - Crea una nuova notifica
- `GET /api/notifications` - Lista tutte le notifiche
- `PUT /api/notifications/:id/read` - Segna come letta
- `PUT /api/notifications/mark-all-read` - Segna tutte come lette
- `DELETE /api/notifications/:id` - Elimina una notifica
- `DELETE /api/notifications` - Elimina tutte le notifiche

## Scripts

- `npm start` - Avvia il server in produzione
- `npm run dev` - Avvia il server in modalità sviluppo
- `npm run build` - Compila il codice TypeScript
- `npm run migrate` - Esegue le migrazioni del database
- `npm run generate` - Genera nuove migrazioni
- `npm run lint` - Esegue il linting del codice
- `npm test` - Esegue i test
- `npm run prepare-deploy` - Prepara il pacchetto per il deploy

## Deploy su Plesk

1. Prepara il pacchetto per il deploy:
   ```bash
   npm run prepare-deploy
   ```

2. Carica e installa su Plesk:
   ```bash
   scp app.tar.gz {{USER}}@{{IP_SERVER}}:{{HTTPDOCS_PATH}}
   ssh {{USER}}@{{IP_SERVER}}
   cd {{HTTPDOCS_PATH}}
   tar xzf app.tar.gz && rm app.tar.gz
   npm install --production
   ```

3. Configura Node.js in Plesk:
   - Abilita Node.js per il dominio
   - Imposta il documento principale (`app.js` o `server.js`)
   - Configura le variabili d'ambiente
   - Riavvia l'applicazione

## Sicurezza

- Tutte le richieste API richiedono autenticazione (Firebase + JWT)
- Implementata protezione CORS
- Dati sensibili crittografati
- Rate limiting per prevenire abusi
- Validazione input per prevenire injection

## Licenza

ISC# applicazione
