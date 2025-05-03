//import logo from './logo.svg';
//import './App.css';
import { useState } from 'react';
import DataLoader from './components/DataLoader';
import { analyzeSleep } from './utils/analyzeSleep';


function App() 
{
  const [analysis, setAnalysis] = useState(null);

  function handleData(data) //funzione callback
  {
    setAnalysis(analyzeSleep(data));
  }

  return (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>
      <DataLoader filename="4-sleep_data_2025-02-11.csv" onData={handleData} />

      {analysis && (
        <div className="analysis-card">
          <h2>Risultati Analisi</h2>
          <p><strong>Punteggio:</strong> {analysis.score}/100</p>
          <p><strong>Interpretazione:</strong> {analysis.interpretation}</p>
          <p><strong>Ore totali dormite:</strong> {analysis.hours.toFixed(2)} h</p>
          <ul>
            <li>Light: {analysis.minuteCounts.Light} min</li>
            <li>Deep: {analysis.minuteCounts.Deep} min</li>
            <li>REM: {analysis.minuteCounts.REM} min</li>
            <li>Awake: {analysis.minuteCounts.Awake} min</li>
            <li>Unknown: {analysis.minuteCounts.unknown} min</li>

          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
