import { useState } from 'react'; //gesstione dello stato
import DataLoader from './components/DataLoader';
import { analyzeSleep } from './utils/CalculateScore';
import SleepScoreCard from './components/SleepScoreCard';
import Tips from './components/Tips';                     //questi sono tutti i componenti per far funzionare correttamente la nostra app
import SleepChartPie from './components/SleepChartPie';
import SleepChartTimeline from './components/SleepChartTimeline';
import SleepTrends from './components/SleepTrends';
import SleepTrendsScore from './components/SleepTrendsScore';


function App() 
{
  const [selectedDate, setSelectedDate] = useState('2025-02-11'); //data di default
  const [analysis, setAnalysis] = useState(null); //contiene le analisi della data selezionata
  const [allRecords, setAllRecords] = useState([]); //contiene tutte le analisi di tutte le date
  

  const handleDateChange = (e) => {   //funzione che permette il cambio di data
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  const handleData = (data) => {    //funzione per caricare l'analisi del giorno corretto e aggiorna l'analisi
    if (!data || data.length === 0) {
      setAnalysis(null);
      return;
    }

    const currentDate = data[0]?.date;

    const analysisResult = analyzeSleep(data);  //calcola il punteggio della data selezionata
    setAnalysis(analysisResult);

    setAllRecords(prev =>         //setta i record evitando duplicati della data corrente
      [...prev.filter(d => d.date !== currentDate), ...data]
    );
  };

  return (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>

      <div className="date_picker">
        <label>Seleziona una data: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <DataLoader filename={`4-sleep_data_${selectedDate}.csv`} onData={handleData} />

      {analysis ? (
        <div className="analysis-card">
          <SleepScoreCard analysis={analysis} />
          <Tips analysis={analysis} />
          <SleepChartPie data={analysis} />
          <SleepChartTimeline data={analysis.rawData} />
        </div>
      ) : (
        <p style={{ marginTop: '1rem' }}>Nessun dato disponibile per questa data.</p>
      )}

{allRecords.length > 0 && (
  <>
    <SleepTrends records={allRecords} selectedDate={new Date(selectedDate)} />    {/* sarebbe meglio passare un array di date così si può tirare giù tutte le date */}
    <SleepTrendsScore records={allRecords} selectedDate={new Date(selectedDate)} />
  </>
)}

    </div>
  );
}

export default App;