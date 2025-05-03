import Papa from 'papaparse'; //libreria obbligatoria

// funzione che legge il CSV da public/data 
// 
// leggo i dati cosi': { timestamp: Date, stage: string }

export function loadSleepCsv(filename) //la esporto per usarla in ../src/components/DataLoader.jsx
{
  return new Promise((resolve, reject) => //operazione asincrona che si risolve (resolve) se il caricamento dei dati va bene, oppure si rifiuta (reject) se c'è un errore.
  {
    Papa.parse(`${process.env.PUBLIC_URL}/data/${filename}`, //recupera il file
    {
      download: true, //si tira giu' il file
      header: true, //legge la prima riga del csv come intestazione
      dynamicTyping: true, //interpreta automaticamente date e valori
      complete: (results) => 
      {
        const data = results.data
          .filter(r => r['Timestamp']) //rimuove eventuali righe vuote
          .map(r => (     //conversione in date e valori
          {                
            timestamp: new Date(r['Timestamp']),
            stage: r['Sleep Stage']
          }));
        resolve(data);
      },
      error: reject
    });
  });
}
