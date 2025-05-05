import { useState } from 'react';
import DataLoader from './components/DataLoader';
import { analyzeSleep } from './utils/CalculateScore';
import SleepScoreCard from './components/SleepScoreCard';
import Tips from './components/Tips';
import SleepChartPie from './components/SleepChartPie';
import SleepChartTimeline from './components/SleepChartTimeline';
import SleepTrends from './components/SleepTrends';
import SleepTrendsScore from './components/SleepTrendsScore';


function App() {
  const [selectedDate, setSelectedDate] = useState('2025-02-11');
  const [analysis, setAnalysis] = useState(null);
  const [allRecords, setAllRecords] = useState([]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setAnalysis(null);
  };

  const handleData = (data) => {
    if (!data || data.length === 0) {
      setAnalysis(null);
      return;
    }

    const currentDate = data[0]?.date;

    const analysisResult = analyzeSleep(data);
    setAnalysis(analysisResult);

    // Sostituisci i dati per la data corrente, evitando duplicati
    setAllRecords(prev =>
      [...prev.filter(d => d.date !== currentDate), ...data]
    );
  };

  return (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>

      <div className="date-picker">
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
    <SleepTrends records={allRecords} selectedDate={new Date(selectedDate)} />
    <SleepTrendsScore records={allRecords} selectedDate={new Date(selectedDate)} />
  </>
)}

    </div>
  );
}

export default App;
