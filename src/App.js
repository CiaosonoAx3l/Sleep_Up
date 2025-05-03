//import logo from './logo.svg';
//import './App.css';
import { useState } from 'react';
import DataLoader from './components/DataLoader';

function App() 
{

  const [analysis, setAnalysis] = useState(null);

  function handleData(data) 
  {
    setAnalysis(analyzeSleep(data));
  }

  return 
  (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>

      <DataLoader filename="4-sleep_data_2025-02-11.csv" onData={ (handleData)  => console.log(dati)} />
    </div>
  );
}

export default App;
