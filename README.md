# Sleep_Up

Questa è un'app React per la visualizzazione dei dati del sonno presi da un file CSV, con grafici, punteggio e analisi.

##Requisiti

- Node.js e npm installati (consigliata Node 18.0.2)
- JavaScript

##Avvio del progetto

1. **Clona il repository**

   ~~ nella bash ~~

   git clone <repo-url>
   cd nome-cartella-progetto

2. **Installa le dipendenze**

    ~~ nella bash ~~

    Copia
    Modifica
    npm install
    npm install recharts
    npm install papaparse

3. **Avvio dell'app**

    ~~ nella bash ~~

    npm start

4.**Controlla le dipendenze principali**

    Controlla che nel file package.json ci siano le seguenti versioni minime:
    {
        dependencies: 
        {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "recharts": "^2.1.0",
            "papaparse": "^5.4.1"
        }
    }

5. **dati**

    Il file CSV (sleepData.csv) deve essere posizionato nella cartella public/data/.

    La struttura del CSV deve essere:
    {
        Timestamp,Sleep Stage
        2024-01-01T22:00:00Z,Light
        2024-01-01T22:30:00Z,Deep
        ...
    }

**📄Organizzazione della struttura**

"src/utils/..": contiene funzioni js che prendono i dati e li convertono.

"src/components/..:" contiene i componenti React per creare grafici e visualizzazioni.


Sviluppato da:
Mercede Alessandro & De Togni Sofia                                                        