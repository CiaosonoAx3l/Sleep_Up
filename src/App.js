//import logo from './logo.svg';
//import './App.css';
import { useState } from 'react';
import DataLoader from './components/DataLoader';

function App() 
{
  function handleData(data) //funzione callback
  {

  }

  return (
    <div className="App_page">
      <h1 className="Title">Sleep Up</h1>

      <DataLoader filename="4-sleep_data_2025-02-11.csv" onData={handleData} />
    </div>
  );
}

export default App;
