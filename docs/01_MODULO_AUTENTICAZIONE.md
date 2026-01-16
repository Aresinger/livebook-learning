# Modulo 01: Sistema di Autenticazione

## 🎯 INTRODUZIONE

### Cosa Costruiremo

Un sistema di autenticazione completo che permetterà a:
- **Artisti** di registrarsi e accedere alla piattaforma
- **Locali** di registrarsi e accedere alla piattaforma

### Perché È Importante

L'autenticazione è la **base** di ogni applicazione con utenti personalizzati.

Senza un sistema sicuro di login:
- ❌ Non puoi personalizzare l'esperienza utente
- ❌ Non puoi salvare dati specifici dell'utente
- ❌ Non puoi proteggere informazioni sensibili
- ❌ Non puoi distinguere chi fa cosa nell'app

### Cosa Imparerai

Alla fine di questo modulo saprai:
- ✅ Come funziona un sistema di autenticazione moderno
- ✅ Cosa sono JWT tokens e sessioni
- ✅ Come usare Supabase Auth API
- ✅ Come proteggere route in React
- ✅ Come gestire ruoli utente (Artista/Locale)
- ✅ Come implementare OAuth con Google
- ✅ Come gestire lo stato dell'autenticazione con Redux

---

## 🧠 CONCETTI TEORICI

### Come Funziona l'Autenticazione?

**Flow Completo di Registrazione:**

```
1. User compila form registrazione
   - Email
   - Password
   - Ruolo (Artista o Locale)
   ↓
2. Dati inviati a Supabase
   ↓
3. Supabase:
   - Verifica che email non esista già
   - Cripta la password (hash + salt)
   - Salva user nel database
   - Invia email di verifica
   ↓
4. User clicca link nell'email
   ↓
5. Account verificato ✅
   ↓
6. User può fare login
```

**Flow di Login:**

```
1. User inserisce email + password
   ↓
2. Supabase verifica credenziali
   ↓
3. Se corrette:
   - Genera JWT token
   - Restituisce dati utente
   ↓
4. App salva token (in cookie HTTP-only)
   ↓
5. Ogni richiesta successiva include token
   ↓
6. Supabase verifica token → accesso OK ✅
```

---

### Cos'è un JWT Token?

**JWT = JSON Web Token**

È come un **"pass VIP"** per l'app:

```
Esempio JWT:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwiZW1haWwiOiJhcnRpc3RhQGV4YW1wbGUuY29tIiwicm9sZSI6ImFydGlzdGEiLCJleHAiOjE3MDk4NTAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Decodificato contiene:
{
  "user_id": "123",
  "email": "artista@example.com",
  "role": "artista",
  "exp": 1709850000  // timestamp scadenza
}
```

**Analogia del Biglietto del Concerto:**

```
JWT = Biglietto concerto con ologramma

✅ Nome sul biglietto (user_id)
✅ Tipo posto (role: "artista" o "locale")
✅ Data validità (exp - expiration)
✅ Firma organizzatore (signature crittografica)

Senza biglietto valido → Non entri! ❌
Biglietto scaduto → Non entri! ❌
Biglietto falsificato → Non entri! ❌
```

**Vantaggi JWT:**
- 🔒 **Sicuro**: Firma crittografica impossibile da falsificare
- ⚡ **Veloce**: Server non deve cercare sessione in database
- 📦 **Self-contained**: Contiene tutte le info necessarie
- 🌐 **Stateless**: Server non memorizza sessioni

---

### Perché Supabase per l'Auth?

**Alternative:**

| Soluzione | Pro | Contro |
|-----------|-----|--------|
| **Auth custom** | Controllo totale | Devi scrivere tutto, rischi sicurezza |
| **Firebase** | Completo, scalabile | Google ecosystem, pricing |
| **Auth0** | Enterprise-grade | Complesso, costoso |
| **Supabase** ✅ | Open source, facile, gratuito | Relativamente nuovo |

**Cosa offre Supabase Auth:**
- ✅ Email/Password automatico
- ✅ OAuth (Google, GitHub, etc.)
- ✅ Magic Links (login senza password)
- ✅ Email verification
- ✅ Password reset
- ✅ JWT tokens gestiti automaticamente
- ✅ Row Level Security (RLS) nel database
- ✅ **Gratuito** fino a 50,000 utenti attivi/mese

---

## 🤔 DOMANDE GUIDA

### Domanda 1: Dove Salvare le Credenziali?

**Scenario:** Dopo il login, dobbiamo salvare il token JWT. Dove?

**Opzione A: localStorage**
```javascript
localStorage.setItem('token', 'eyJhbGc...');
```
- ✅ Semplice da usare
- ✅ Persiste dopo chiusura browser
- ❌ **Vulnerabile a XSS** (Cross-Site Scripting)
- ❌ JavaScript può accedere → pericoloso

**Opzione B: sessionStorage**
```javascript
sessionStorage.setItem('token', 'eyJhbGc...');
```
- ✅ Semplice da usare
- ❌ Si cancella alla chiusura tab
- ❌ **Vulnerabile a XSS**

**Opzione C: Cookie HTTP-only** ✅
```
Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
```
- ✅ **Non accessibile da JavaScript** → Immune a XSS
- ✅ Inviato automaticamente con ogni richiesta
- ✅ Può avere flag Secure (solo HTTPS)
- ✅ SameSite protection contro CSRF

**Scelta: Supabase usa Cookie HTTP-only automaticamente!** ✅

---

### Domanda 2: Come Distinguere Artista vs Locale?

**Scenario:** Un utente si registra. Come sappiamo se è un Artista o un Locale?

**Opzione A: Campo "role" nel database**
```javascript
user = {
  id: "123",
  email: "test@example.com",
  role: "artista"  // oppure "locale"
}
```
- ✅ Semplice
- ✅ Un utente = un ruolo
- ❌ Se in futuro un utente vuole entrambi i ruoli?

**Opzione B: Tabelle separate**
```sql
CREATE TABLE artisti (
  user_id UUID REFERENCES auth.users,
  nome_arte TEXT,
  genere TEXT,
  ...
);

CREATE TABLE locali (
  user_id UUID REFERENCES auth.users,
  nome_locale TEXT,
  capienza INTEGER,
  ...
);
```
- ✅ Dati specifici per ogni tipo
- ✅ Flessibile (un user può essere entrambi)
- ❌ Più complesso da gestire

**Scelta per questo modulo: Opzione A (semplice)**

Nella versione finale di Livebook useremo Opzione B per flessibilità.

---

### Domanda 3: Quando Verificare l'Autenticazione?

**Scenario:** User visita la pagina Dashboard. Quando controlliamo se è loggato?

**Opzione A: Solo al mount del componente**
```javascript
useEffect(() => {
  if (!user) redirect('/login');
}, []);
```
- ❌ Se token scade durante l'uso?
- ❌ Non protegge route

**Opzione B: Wrapper componente (Higher Order Component)**
```javascript
<RouteProtetta>
  <Dashboard />
</RouteProtetta>
```
- ✅ Controllo centralizzato
- ✅ Riutilizzabile
- ✅ Protegge automaticamente

**Opzione C: React Router loader**
```javascript
{
  path: '/dashboard',
  element: <Dashboard />,
  loader: verificaAuth
}
```
- ✅ Controllo prima del render
- ✅ Può fare redirect prima
- ⚠️ Più avanzato

**Scelta: Opzione B (semplice e chiara)**

---

## 💡 LOGICA PASSO-PASSO

### Step 1: Analisi Componenti Necessari

**Ragioniamo insieme:**

1. **User deve registrarsi** → Serve un form
   - Input: email, password, conferma password, ruolo
   - Validazione dati
   - Submit a Supabase
   - **Componente:** `<FormRegistrazione />`

2. **User deve fare login** → Serve un form
   - Input: email, password
   - Submit a Supabase
   - **Componente:** `<FormLogin />`

3. **User sceglie se è Artista o Locale** → Serve un selettore
   - Radio buttons o bottoni
   - **Componente:** `<SelettoreRuolo />`

4. **App deve "ricordare" chi è loggato** → Serve state globale
   - Redux store
   - Dati utente corrente
   - **File:** `authSlice.js`

5. **Alcune pagine solo per utenti loggati** → Serve protezione route
   - Controllo automatico
   - Redirect a /login se non autenticato
   - **Componente:** `<RouteProtetta />`

6. **Componenti devono sapere se user è loggato** → Serve hook custom
   - Accesso facile allo stato auth
   - **Hook:** `useAuth()`

**Lista finale componenti:**
```
✅ <FormRegistrazione />
✅ <FormLogin />
✅ <SelettoreRuolo />
✅ authSlice.js (Redux)
✅ <RouteProtetta />
✅ useAuth() (hook)
✅ supabase.js (config)
```

---

### Step 2: Architettura State Management

**Cosa deve tracciare Redux?**

Ragioniamo sui diversi stati possibili:

**Scenario 1: App appena aperta**
```javascript
state = {
  utente: null,        // Nessuno loggato
  caricamento: true,   // Stiamo verificando se c'è una sessione
  errore: null
}
```

**Scenario 2: Login in corso**
```javascript
state = {
  utente: null,
  caricamento: true,   // Mostra spinner
  errore: null
}
```

**Scenario 3: Login riuscito**
```javascript
state = {
  utente: {
    id: "123",
    email: "artista@example.com",
    role: "artista"
  },
  caricamento: false,
  errore: null
}
```

**Scenario 4: Login fallito**
```javascript
state = {
  utente: null,
  caricamento: false,
  errore: "Email o password errati"  // Mostra messaggio
}
```

**Struttura finale:**
```javascript
const initialState = {
  utente: null,        // null | { id, email, role }
  caricamento: false,  // boolean
  errore: null        // null | string (messaggio errore)
};
```

---

### Step 3: Flow di Registrazione

**Sequenza dettagliata:**

```
1. User compila FormRegistrazione
   - email: "mario@example.com"
   - password: "Password123!"
   - confermaPassword: "Password123!"
   - ruolo: "artista"

2. Click su "Registrati"
   ↓
3. Validazione frontend:
   - Email valida? ✅
   - Password >= 8 caratteri? ✅
   - Password == confermaPassword? ✅
   - Ruolo selezionato? ✅
   ↓
4. Dispatch Redux action: iniziaCaricamento()
   → state.caricamento = true
   → UI mostra spinner
   ↓
5. Chiamata Supabase:
   await supabase.auth.signUp({
     email: "mario@example.com",
     password: "Password123!",
     options: {
       data: { role: "artista" }
     }
   })
   ↓
6a. SE SUCCESSO:
    - Supabase crea utente
    - Invia email verifica
    - Ritorna dati utente
    ↓
    Dispatch: impostaUtente(datiUtente)
    → state.utente = {...}
    → state.caricamento = false
    ↓
    Redirect a /verifica-email

6b. SE ERRORE:
    - Es: "Email già registrata"
    ↓
    Dispatch: impostaErrore("Email già esistente")
    → state.errore = "..."
    → state.caricamento = false
    ↓
    Mostra alert con errore
```

---

### Step 4: Flow di Login

```
1. User compila FormLogin
   - email: "mario@example.com"
   - password: "Password123!"

2. Click su "Accedi"
   ↓
3. Validazione frontend:
   - Campi non vuoti? ✅
   ↓
4. Dispatch: iniziaCaricamento()
   ↓
5. Chiamata Supabase:
   await supabase.auth.signInWithPassword({
     email: "mario@example.com",
     password: "Password123!"
   })
   ↓
6a. SE SUCCESSO:
    - Supabase verifica credenziali
    - Genera JWT token
    - Salva in cookie HTTP-only
    - Ritorna dati utente
    ↓
    Dispatch: impostaUtente(datiUtente)
    ↓
    Redirect a /dashboard

6b. SE ERRORE:
    - Es: "Credenziali non valide"
    ↓
    Dispatch: impostaErrore("Email o password errati")
    ↓
    Mostra alert
```

---

### Step 5: Protezione Route

**Come funziona `<RouteProtetta>`:**

```javascript
function RouteProtetta({ children }) {

  // 1. Ottieni stato auth da Redux
  const { utente, caricamento } = useAuth();

  // 2. Se ancora sta caricando → mostra spinner
  if (caricamento) {
    return <Spinner />;
  }

  // 3. Se nessun utente loggato → redirect a login
  if (!utente) {
    return <Navigate to="/login" />;
  }

  // 4. Se tutto OK → mostra componente protetto
  return children;
}

// Uso:
<RouteProtetta>
  <Dashboard />  // ← Visibile solo se loggato
</RouteProtetta>
```

---

## 🏗️ ARCHITETTURA

### Struttura File Completa

```
moduli/01-autenticazione/
│
├── src/
│   │
│   ├── config/
│   │   └── supabase.js              # Configurazione client Supabase
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── authSlice.js         # Redux slice per auth
│   │       ├── FormLogin.jsx        # Componente form login
│   │       ├── FormRegistrazione.jsx # Componente form registrazione
│   │       └── SelettoreRuolo.jsx   # Selettore ruolo (Artista/Locale)
│   │
│   ├── components/
│   │   ├── RouteProtetta.jsx        # HOC per proteggere route
│   │   └── Navbar.jsx               # Navbar con logout
│   │
│   ├── hooks/
│   │   └── useAuth.js               # Custom hook per accedere allo stato auth
│   │
│   ├── pages/
│   │   ├── HomePage.jsx             # Landing page
│   │   ├── LoginPage.jsx            # Pagina login
│   │   ├── RegistrazionePage.jsx    # Pagina registrazione
│   │   ├── DashboardPage.jsx        # Dashboard (protetta)
│   │   └── VerificaEmailPage.jsx    # Pagina conferma email
│   │
│   ├── store/
│   │   └── store.js                 # Configurazione Redux store
│   │
│   ├── App.jsx                      # Root component con routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Stili globali (Tailwind)
│
├── .env.example                     # Template variabili ambiente
├── .env                             # Variabili ambiente (NON committare!)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

### Relazioni tra Componenti

```
App.jsx
  │
  ├── Provider (Redux)
  │     │
  │     └── Router
  │           │
  │           ├── / → HomePage
  │           │
  │           ├── /login → LoginPage
  │           │              └── FormLogin
  │           │                    └── usa authSlice
  │           │
  │           ├── /registrazione → RegistrazionePage
  │           │                      ├── SelettoreRuolo
  │           │                      └── FormRegistrazione
  │           │                            └── usa authSlice
  │           │
  │           └── /dashboard → RouteProtetta
  │                              │  └── usa useAuth()
  │                              │
  │                              └── DashboardPage
  │                                    └── Navbar
  │                                          └── usa useAuth()
```

---

### Flow Dati Redux

```
Componente                Action                 Reducer               State
────────────────────────────────────────────────────────────────────────────

FormLogin
  │
  ├─ onClick ─→ dispatch(login()) ──→ iniziaCaricamento() ──→ caricamento: true
  │                  │
  │                  └─→ supabase.signIn()
  │                         │
  │                         ├─ ✅ Success ─→ impostaUtente() ──→ utente: {...}
  │                         │                                      caricamento: false
  │                         │
  │                         └─ ❌ Error ──→ impostaErrore() ──→ errore: "..."
  │                                                               caricamento: false
  │
  └─ useSelector ←─────────────────────────────────────────── State aggiornato
       │
       └─ Mostra UI basata su state
```

---

## 💻 IMPLEMENTAZIONE

### Setup Iniziale

#### 1. Crea Account Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Clicca "Start your project"
3. Registrati con GitHub o email
4. Crea nuovo progetto:
   - **Name:** `livebook-auth`
   - **Database Password:** Crea password sicura (salvala!)
   - **Region:** Europe West (Ireland) - più vicino all'Italia
5. Attendi 2 minuti per provisioning

#### 2. Ottieni API Keys

1. Nel dashboard Supabase, vai su **Settings** (icona ingranaggio)
2. Clicca **API**
3. Copia:
   - **Project URL** (es: `https://abcdefgh.supabase.co`)
   - **anon/public key** (una stringa lunga)

⚠️ **IMPORTANTE:** La `anon key` è sicura da usare nel frontend (ha permessi limitati)

---

### Passo 1: Setup Progetto Vite

```bash
# Vai nella cartella moduli
cd moduli/01-autenticazione

# Crea progetto Vite con React
npm create vite@latest . -- --template react

# Installa dipendenze base
npm install

# Installa dipendenze progetto
npm install @supabase/supabase-js @reduxjs/toolkit react-redux react-router-dom

# Installa Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Passo 2: Configurazione Tailwind

**File: `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File: `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Passo 3: Variabili Ambiente

**File: `.env`** (crea nuovo file nella root del progetto)

```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-anon-key-qui
```

⚠️ **Sostituisci** con le TUE chiavi di Supabase!

**File: `.env.example`** (template per altri dev)

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**File: `.gitignore`** (aggiungi se non presente)

```
.env
```

**Perché .env?**

```
✅ Nasconde credenziali sensibili
✅ Diversi valori per dev/staging/production
✅ Non committato su GitHub (sicurezza)
✅ Vite legge automaticamente VITE_* variables
```

---

### Passo 4: Configurazione Supabase Client

**File: `src/config/supabase.js`**

```javascript
import { createClient } from '@supabase/supabase-js';

// Leggi variabili ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validazione: assicurati che le variabili esistano
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Mancano le variabili VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY nel file .env'
  );
}

// Crea e esporta il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SPIEGAZIONE:
 *
 * createClient() inizializza la connessione a Supabase.
 *
 * Questo oggetto 'supabase' sarà usato in tutta l'app per:
 *
 * AUTH:
 * - supabase.auth.signUp() → Registrazione
 * - supabase.auth.signInWithPassword() → Login
 * - supabase.auth.signOut() → Logout
 * - supabase.auth.getSession() → Verifica sessione
 * - supabase.auth.onAuthStateChange() → Listener cambiamenti auth
 *
 * DATABASE (useremo nei moduli futuri):
 * - supabase.from('tabella').select() → Query dati
 * - supabase.from('tabella').insert() → Inserisci dati
 *
 * STORAGE (useremo nel modulo Profilo):
 * - supabase.storage.from('bucket').upload() → Upload file
 */
```

---

### Passo 5: Redux Store Setup

**File: `src/features/auth/authSlice.js`**

```javascript
import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux Slice per gestire lo stato dell'autenticazione
 *
 * State structure:
 * {
 *   utente: null | {
 *     id: string,
 *     email: string,
 *     role: 'artista' | 'locale'
 *   },
 *   caricamento: boolean,
 *   errore: string | null
 * }
 */

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    utente: null,        // Utente corrente loggato
    caricamento: false,  // True durante login/registrazione
    errore: null        // Messaggio di errore se presente
  },

  reducers: {
    /**
     * Imposta l'utente loggato
     * Chiamato dopo login/registrazione riusciti
     */
    impostaUtente: (state, action) => {
      state.utente = action.payload;
      state.caricamento = false;
      state.errore = null;
    },

    /**
     * Inizia operazione di caricamento
     * Mostra spinner nell'UI
     */
    iniziaCaricamento: (state) => {
      state.caricamento = true;
      state.errore = null;
    },

    /**
     * Imposta messaggio di errore
     * Es: "Email già registrata", "Password errata"
     */
    impostaErrore: (state, action) => {
      state.errore = action.payload;
      state.caricamento = false;
    },

    /**
     * Pulisce messaggio di errore
     * Chiamato quando user corregge input
     */
    pulisciErrore: (state) => {
      state.errore = null;
    },

    /**
     * Logout: pulisce tutto lo state
     */
    logout: (state) => {
      state.utente = null;
      state.caricamento = false;
      state.errore = null;
    }
  }
});

// Esporta le actions per usarle nei componenti
export const {
  impostaUtente,
  iniziaCaricamento,
  impostaErrore,
  pulisciErrore,
  logout
} = authSlice.actions;

// Esporta il reducer per lo store
export default authSlice.reducer;

/**
 * COME USARE QUESTE ACTIONS:
 *
 * In un componente:
 *
 * import { useDispatch } from 'react-redux';
 * import { impostaUtente, iniziaCaricamento } from './authSlice';
 *
 * const dispatch = useDispatch();
 *
 * // Inizia caricamento
 * dispatch(iniziaCaricamento());
 *
 * // Imposta utente dopo login
 * dispatch(impostaUtente({
 *   id: '123',
 *   email: 'mario@example.com',
 *   role: 'artista'
 * }));
 */
```

**File: `src/store/store.js`**

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

/**
 * Redux Store Configuration
 *
 * Lo store è il "cervello" dell'app che contiene tutto lo stato globale
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,  // State.auth conterrà lo stato dell'autenticazione
    // Altri reducer verranno aggiunti qui nei moduli futuri
    // profilo: profiloReducer,
    // ricerca: ricercaReducer,
    // etc.
  },

  // Redux DevTools abilitato automaticamente in development
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * STRUTTURA STATE GLOBALE:
 *
 * {
 *   auth: {
 *     utente: null,
 *     caricamento: false,
 *     errore: null
 *   }
 * }
 *
 * Per accedere:
 * const utente = useSelector(state => state.auth.utente);
 */
```

---

### Passo 6: Custom Hook useAuth

**File: `src/hooks/useAuth.js`**

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../config/supabase';
import {
  impostaUtente,
  iniziaCaricamento,
  impostaErrore,
  logout as logoutAction
} from '../features/auth/authSlice';

/**
 * Custom Hook per gestire autenticazione
 *
 * Fornisce accesso allo stato auth e funzioni helper
 *
 * @returns {Object} - Stato e funzioni auth
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  // Ottieni stato auth da Redux
  const { utente, caricamento, errore } = useSelector(state => state.auth);

  /**
   * Funzione per registrare nuovo utente
   *
   * @param {string} email
   * @param {string} password
   * @param {string} role - 'artista' o 'locale'
   */
  const registrazione = async (email, password, role) => {
    try {
      // Inizia caricamento (mostra spinner)
      dispatch(iniziaCaricamento());

      // Chiamata Supabase per registrazione
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role  // Salva ruolo nei metadata utente
          }
        }
      });

      // Gestisci errore
      if (error) throw error;

      // Successo: imposta utente
      dispatch(impostaUtente({
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role
      }));

      return { success: true };

    } catch (error) {
      // Gestisci errore
      dispatch(impostaErrore(error.message));
      return { success: false, error: error.message };
    }
  };

  /**
   * Funzione per login
   *
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    try {
      dispatch(iniziaCaricamento());

      // Chiamata Supabase per login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Successo: imposta utente
      dispatch(impostaUtente({
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role || 'artista'
      }));

      return { success: true };

    } catch (error) {
      dispatch(impostaErrore(error.message));
      return { success: false, error: error.message };
    }
  };

  /**
   * Funzione per logout
   */
  const logout = async () => {
    try {
      // Logout da Supabase (rimuove sessione)
      await supabase.auth.signOut();

      // Pulisci state Redux
      dispatch(logoutAction());

      return { success: true };

    } catch (error) {
      dispatch(impostaErrore(error.message));
      return { success: false, error: error.message };
    }
  };

  /**
   * Funzione per verificare sessione esistente
   * Chiamata all'avvio dell'app
   */
  const verificaSessione = async () => {
    try {
      dispatch(iniziaCaricamento());

      // Ottieni sessione corrente da Supabase
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Sessione esistente: imposta utente
        dispatch(impostaUtente({
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata.role || 'artista'
        }));
      } else {
        // Nessuna sessione
        dispatch(logoutAction());
      }

    } catch (error) {
      dispatch(impostaErrore(error.message));
    }
  };

  // Ritorna stato e funzioni
  return {
    // Stato
    utente,
    caricamento,
    errore,
    isAutenticato: !!utente,  // true se utente loggato

    // Funzioni
    registrazione,
    login,
    logout,
    verificaSessione
  };
};

/**
 * ESEMPIO USO:
 *
 * function MioComponente() {
 *   const { utente, login, isAutenticato } = useAuth();
 *
 *   const handleLogin = async () => {
 *     const result = await login('test@example.com', 'password123');
 *     if (result.success) {
 *       console.log('Login riuscito!');
 *     }
 *   };
 *
 *   if (isAutenticato) {
 *     return <div>Ciao {utente.email}!</div>;
 *   }
 *
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 */
```

---

### Passo 7: Componente Route Protetta

**File: `src/components/RouteProtetta.jsx`**

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Higher Order Component per proteggere route
 *
 * Permette accesso solo a utenti autenticati
 * Se non loggato → redirect a /login
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente da proteggere
 */
export const RouteProtetta = ({ children }) => {
  const { isAutenticato, caricamento } = useAuth();

  // Se sta ancora verificando la sessione, mostra loader
  if (caricamento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se non autenticato, redirect a login
  if (!isAutenticato) {
    return <Navigate to="/login" replace />;
  }

  // Utente autenticato: mostra contenuto protetto
  return children;
};

/**
 * USO:
 *
 * In App.jsx:
 *
 * <Routes>
 *   <Route path="/login" element={<LoginPage />} />
 *
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <RouteProtetta>
 *         <DashboardPage />
 *       </RouteProtetta>
 *     }
 *   />
 * </Routes>
 */
```

---

### Passo 8: Componenti UI - Selettore Ruolo

**File: `src/features/auth/SelettoreRuolo.jsx`**

```javascript
/**
 * Componente per scegliere ruolo: Artista o Locale
 *
 * @param {Object} props
 * @param {string} props.ruoloSelezionato - 'artista' | 'locale' | null
 * @param {Function} props.onSeleziona - Callback quando si seleziona ruolo
 */
export const SelettoreRuolo = ({ ruoloSelezionato, onSeleziona }) => {

  const ruoli = [
    {
      valore: 'artista',
      titolo: 'Sono un Artista',
      descrizione: 'Cerco locali per esibirmi',
      icona: '🎸'
    },
    {
      valore: 'locale',
      titolo: 'Sono un Locale',
      descrizione: 'Cerco artisti per eventi',
      icona: '🏪'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Chi sei?
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ruoli.map(ruolo => (
          <button
            key={ruolo.valore}
            type="button"
            onClick={() => onSeleziona(ruolo.valore)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${ruoloSelezionato === ruolo.valore
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">{ruolo.icona}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {ruolo.titolo}
                </h3>
                <p className="text-sm text-gray-600">
                  {ruolo.descrizione}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * SPIEGAZIONE STILI TAILWIND:
 *
 * space-y-3: Spazio verticale tra elementi
 * grid grid-cols-1 md:grid-cols-2: Griglia 1 col mobile, 2 col desktop
 * gap-4: Spazio tra celle griglia
 * border-2: Bordo spesso 2px
 * rounded-lg: Angoli arrotondati
 * transition-all: Animazione smooth su tutti i cambi
 * hover:border-gray-400: Bordo grigio scuro al passaggio mouse
 *
 * Condizionale con template string:
 * ${condizione ? 'classi-se-vero' : 'classi-se-falso'}
 */
```

---

*[Continua con FormRegistrazione, FormLogin, Pages, App.jsx...]*

*Il documento continua con tutti gli altri componenti e implementazioni dettagliate. Per brevità, ti mostro la struttura che seguirà:*

---

## 🧪 TESTING

### Test Manuali

**Checklist Registrazione:**
- [ ] Form valida input corretti
- [ ] Mostra errori se email non valida
- [ ] Mostra errore se password < 8 caratteri
- [ ] Mostra errore se password ≠ confermaPassword
- [ ] Mostra errore se nessun ruolo selezionato
- [ ] Mostra errore se email già esistente
- [ ] Redirect a pagina verifica email dopo successo

**Checklist Login:**
- [ ] Login con credenziali corrette funziona
- [ ] Mostra errore con email errata
- [ ] Mostra errore con password errata
- [ ] Redirect a dashboard dopo login
- [ ] Mantiene sessione dopo refresh pagina

**Checklist Route Protette:**
- [ ] Non posso accedere a /dashboard senza login
- [ ] Redirect automatico a /login
- [ ] Dopo login posso accedere a /dashboard
- [ ] Logout mi riporta a homepage

---

## 🎓 COSA HAI IMPARATO

### Concetti Chiave
✅ Come funziona un sistema di autenticazione moderno
✅ JWT tokens e sessioni
✅ Supabase Auth API
✅ Redux Toolkit per state management
✅ Custom hooks in React
✅ Higher Order Components (RouteProtetta)
✅ React Router v6
✅ Tailwind CSS
✅ Gestione errori async
✅ Variabili ambiente

### Skills Acquisite
✅ Implementare registrazione e login
✅ Gestire stato globale con Redux
✅ Proteggere route in React
✅ Integrare servizi esterni (Supabase)
✅ Validare form lato client
✅ Gestire loading states
✅ Mostrare messaggi di errore user-friendly

---

## 📦 COMPONENTI RIUTILIZZABILI

### Per Livebook Finale

Questi componenti/file saranno riutilizzati così come sono:

```javascript
// Da copiare in Livebook:
src/config/supabase.js           ✅ Config Supabase
src/features/auth/authSlice.js   ✅ Redux auth
src/hooks/useAuth.js             ✅ Hook auth
src/components/RouteProtetta.jsx ✅ Protezione route
src/features/auth/SelettoreRuolo.jsx ✅ UI selettore

// Da adattare leggermente:
src/features/auth/FormLogin.jsx          → Aggiungere styling Livebook
src/features/auth/FormRegistrazione.jsx  → Aggiungere campi extra
```

### Come Integrare in Livebook

```bash
# Nel progetto finale Livebook:
cp -r ../moduli/01-autenticazione/src/features/auth ./src/features/
cp ../moduli/01-autenticazione/src/hooks/useAuth.js ./src/hooks/
cp ../moduli/01-autenticazione/src/components/RouteProtetta.jsx ./src/components/
```

---

## 🔗 RISORSE EXTRA

### Documentazione Ufficiale
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutorial Video
- [Supabase Auth Tutorial](https://www.youtube.com/watch?v=6ow_jW4epf8)
- [Redux Toolkit Tutorial](https://www.youtube.com/watch?v=9zySeP5vH9c)

### Approfondimenti
- [Come funzionano i JWT](https://jwt.io/introduction)
- [OWASP Auth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 📝 PROSSIMI PASSI

Una volta completato questo modulo:

1. ✅ **Test completo** di tutti i flussi
2. ✅ **Commit su GitHub** del modulo funzionante
3. ✅ **Passa al Modulo 02: Profilo Utente**

Nel prossimo modulo implementeremo:
- Form profilo artista con campi specifici
- Form profilo locale con campi specifici
- Upload foto profilo
- Modifica profilo

---

**Fine Modulo 01** 🎉
