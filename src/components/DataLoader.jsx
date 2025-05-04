import { useEffect, useState } from 'react';
import { loadSleepCsv } from '../utils/ParseCsv'; //importo da ../utils/ParseCsv.js la funzione per convertire il csv in oggetti

export default function DataLoader({ filename, onData }) //il componente prende il nome del file da caricare e una funzione callback 
{
  const [loading, setLoading] = useState(true); //dice se i dati sono ancora in caricamento (true) o no (false)
  const [error, setError] = useState(); //messaggio di errore default

  useEffect(() =>       //viene eseguito appena viene chiamato il componente
    {
        loadSleepCsv(filename) //funzione esterna per caricare il csv
        .then(data =>      //solo se viene restituito resolve da loadSleepCsv
        {
            onData(data);           //passa i dati a App.js (a handleData(data))
            setLoading(false);
        })
        .catch(err =>      //in caso di reject da loadSleepCsv
        {
            console.error(err);
            setError('Errore caricamento CSV');
            setLoading(false);
        });
    }, [filename, onData]); //lista dipendenze (deve essere rieseguito il componente se questi cambiano)

  if (loading) return <p>Caricamento dati...</p>;
  if (error)   return <p className="errore">{error}</p>;
  return null;
}
