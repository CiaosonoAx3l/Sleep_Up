# Sleep_Up

Questa è un'app React per la visualizzazione e analisi dei dati del sonno. I dati vengono caricati da un database SQLite3, interrogato dinamicamente tramite un server Node.js. L'app mostra grafici, punteggi e analisi a partire dai dati raccolti da dispositivi wearable.


##Requisiti

- Node.js e npm installati (consigliata Node 18.0.2)
- JavaScript

##Avvio del progetto

1. **Clona il repository**

   ~~ nella bash ~~

   git clone https://github.com/CiaosonoAx3l/Sleep_Up
   cd nome-cartella-progetto

2. **Installa le dipendenze**

    ~~ nella bash ~~

    npm install
    npm install recharts
    npm install papaparse
    npm install express 
    npm install cors 
    npm install sqlite3 

3. **Avvio dell'app & databse**

    ~~ nella bash ~~

    npm start (nella directory del progetto)

    ~~ in una seconda bash ~~

    sqlite3 sleepdata.db < init.sql (nella directory server/db)
    node server.js (nella directory server)

4.**Controlla le dipendenze principali**

    Controlla che nel file package.json ci siano le seguenti versioni minime:
    {
        dependencies: 
        {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "recharts": "^2.1.0",
            "papaparse": "^5.4.1",
            "express": "^4.18.2",
            "sqlite3": "^5.1.6",
            "cors": "^2.8.5"
        }
    }

5. **dati**

    🗃️ Struttura della tabella sleep_records
    {
    sql
    
        CREATE TABLE sleep_records 
        (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        stage TEXT NOT NULL,
        date TEXT NOT NULL
        );
    }

**📄Organizzazione della struttura**

"src/utils/..": contiene funzioni js che prendono i dati e li convertono.

"src/components/..:" contiene i componenti React per creare grafici e visualizzazioni.

"src/server/..:" contiene il database e gli script per avviarlo correttamente.

Sviluppato da:
Mercede Alessandro & De Togni Sofia                                                        