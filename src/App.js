import { useState } from 'react';
import DataLoader from './components/DataLoader';
import { analyzeSleep } from './utils/CalculateScore';
import SleepScoreCard from './components/SleepScoreCard';
import Tips from './components/Tips';
import SleepChartPie from './components/SleepChartPie';
import SleepChartTimeline from './components/SleepChartTimeline';
import SleepTrends from './components/SleepTrends';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [records, setRecords] = useState([]);

  function handleData(data) {
    console.log("Dati ricevuti:", data); // Log dei dati ricevuti
    setRecords(data);

    const analysisResult = analyzeSleep(data);
    console.log("Analisi dei dati:", analysisResult); // Log dell'analisi
    setAnalysis(analysisResult);
  }

  return (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>
      <DataLoader filename="4-sleep_data_2025-02-11.csv" onData={handleData} />

      {analysis && (
        <div className="analysis-card">
          <SleepScoreCard analysis={analysis} />
          <Tips analysis={analysis} />
          <SleepChartPie data={analysis} />
          <SleepChartTimeline data={analysis.rawData} />
          <SleepTrends records={records} />
        </div>
      )}
    </div>
  );
}

export default App;