import React, { useState, useEffect } from "react";
import Login from "./components/Login.js";
import SleepChartPie from "./components/SleepChartPie.jsx";
import SleepChartTimeline from "./components/SleepChartTimeline.jsx";
import SleepScoreCard from "./components/SleepScoreCard.jsx";
import Tips from "./components/Tips.jsx";
import Trends from "./components/Trends.jsx";
import './index.css';

function App() {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));
  const [allSleepData, setAllSleepData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  function analyzeSleep(data) {
    const minuteCounts = { Light: 0, Deep: 0, REM: 0, Awake: 0, unknown: 0 };
    data.forEach(({ stage }) => {
      if (minuteCounts.hasOwnProperty(stage)) {
        minuteCounts[stage]++;
      } else {
        minuteCounts.unknown++;
      }
    });
    const totalMin = data.length;
    const hours = totalMin / 60;
    const score = totalMin
      ? Math.min(100, Math.round(((minuteCounts.Deep + minuteCounts.REM) / totalMin) * 100))
      : 0;

    let interpretation = "Sufficiente";
    if (score > 70) interpretation = "Buono";
    else if (score < 40) interpretation = "Scarso";

    return { minuteCounts, totalMin, score, hours, interpretation };
  }

  function filterByNight(data, dateStr) {
    const date = new Date(dateStr);

    const start = new Date(date);
    start.setDate(start.getDate() - 1);
    start.setHours(20, 0, 0, 0);

    const end = new Date(date);
    end.setHours(12, 0, 0, 0);

    return data.filter(d => {
      const ts = new Date(d.timestamp);
      return ts >= start && ts <= end;
    });
  }

  useEffect(() => {
    if (!userEmail) return;

    setLoading(true);
    localStorage.setItem("userEmail", userEmail);

    fetch(`http://localhost:3001/api/sleep?user=${encodeURIComponent(userEmail)}&start=1900-01-01&end=2999-12-31`)
      .then(res => {
        if (!res.ok) throw new Error("Errore nella risposta del server");
        return res.json();
      })
      .then(data => {
        setAllSleepData(data);
      })
      .catch(err => {
        console.error("Errore nel fetch dei dati:", err);
        setAllSleepData([]);
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  useEffect(() => {
    if (!allSleepData.length) {
      setAnalysis(null);
      return;
    }
    const filteredData = filterByNight(allSleepData, selectedDate);
    setAnalysis(analyzeSleep(filteredData));
  }, [selectedDate, allSleepData]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setUserEmail(null);
    setAllSleepData([]);
    setAnalysis(null);
  };

  if (!userEmail) {
    return <Login onLogin={setUserEmail} />;
  }

  const filteredDataForDate = filterByNight(allSleepData, selectedDate);

  return (
    <>
      {/* onde decorative */}
      <div className="wave"></div>
      <div className="wave"></div>

      {/* contenitore centrale */}
      <div className="app-container mx-auto relative z-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dati del sonno per {userEmail}</h1>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </header>

        <hr className="glow-line" />

        {/* Selettore data */}
        <section className="date-picker mb-6">
          <label htmlFor="datePicker" className="mr-2 font-semibold">Seleziona data:</label>
          <input
            id="datePicker"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </section>

        {/* Contenuto */}
        {loading ? (
          <p className="loading-text">Caricamento dati...</p>
        ) : filteredDataForDate.length > 0 ? (
          <>
            <section className="block">
              <SleepChartPie data={filteredDataForDate} />
            </section>

            <section className="block">
              <SleepChartTimeline data={filteredDataForDate} />
            </section>


            {analysis && <SleepScoreCard analysis={analysis} />}
            {analysis && <Tips analysis={analysis} />}

            <section className="block">
              <h2>Tendenze Sonno</h2>
              <Trends records={allSleepData} initialDate={selectedDate} />
            </section>

           {/* <section className="block">
              <h3>Dettaglio Dati (Tutti i record)</h3>
              <ul className="sleep-data-list">
                {allSleepData.map(entry => (
                  <li key={entry.id}>
                    <strong>{new Date(entry.timestamp).toLocaleString('it-IT')}</strong> - {entry.stage}
                  </li>
                ))}
              </ul>
            </section>*/}
          </>
        ) : (
          <p className="loading-text">Nessun dato disponibile per questa data.</p>
        )}
      </div>
    </>
  );
}

export default App; 
