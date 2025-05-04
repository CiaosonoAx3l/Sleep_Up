//import logo from './logo.svg';
//import './App.css';
import { useState } from 'react';
import DataLoader from './components/DataLoader';
import { analyzeSleep } from './utils/CalculateScore';
import SleepScoreCard from './components/SleepScoreCard';
import Tips from './components/Tips';
import SleepChartPie from './components/SleepChartPie';


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
          <SleepScoreCard analysis={analysis} />

          <Tips analysis={analysis} />
          <SleepChartPie data={analysis} />
        </div>
      )}
    </div>
  );
}

export default App;
