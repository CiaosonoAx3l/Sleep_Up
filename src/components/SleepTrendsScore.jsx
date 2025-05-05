// Importa hook React e componenti del grafico
import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
// Importa la funzione che analizza i dati del sonno e calcola un punteggio
import { analyzeSleep } from '../utils/CalculateScore';

// Componente che mostra i punteggi di qualità del sonno settimanali o mensili
export default function SleepTrendsScore({ records, selectedDate }) {
  // Stato per vista attuale: 'weekly' o 'monthly'
  const [view, setView] = useState('weekly');
  // Stato per la data attualmente selezionata (può cambiare con navigazione)
  const [internalDate, setInternalDate] = useState(selectedDate);

  // Aggiorna internalDate quando cambia selectedDate (prop esterna)
  useEffect(() => {
    setInternalDate(selectedDate);
  }, [selectedDate]);

  // Ritorna il lunedì della settimana della data specificata
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // giorno della settimana
    const diff = (day + 6) % 7; // calcolo dell'offset per arrivare a lunedì
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0); // azzera ore
    return d;
  };

  // Calcola i dati da visualizzare nel grafico in base alla vista e alla data
  const chartData = useMemo(() => {
    if (!records || records.length === 0) return [];

    if (view === 'weekly') {
      // Vista settimanale: crea array di 7 giorni a partire da lunedì
      const start = getStartOfWeek(internalDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { date: d, records: [] };
      });

      // Distribuisce i record nei rispettivi giorni della settimana
      records.forEach(r => {
        const ts = new Date(r.timestamp);
        days.forEach(dayObj => {
          if (
            ts.getFullYear() === dayObj.date.getFullYear() &&
            ts.getMonth() === dayObj.date.getMonth() &&
            ts.getDate() === dayObj.date.getDate()
          ) {
            dayObj.records.push(r);
          }
        });
      });

      // Calcola il punteggio per ogni giorno
      return days.map(dayObj => {
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: dayObj.date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
          score: analysis.score || 0
        };
      });

    } else {
      // Vista mensile: crea array di giorni del mese corrente
      const year = internalDate.getFullYear();
      const month = internalDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const days = Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1, records: [] }));

      // Assegna ogni record al giorno corrispondente
      records.forEach(r => {
        const ts = new Date(r.timestamp);
        if (ts.getFullYear() === year && ts.getMonth() === month) {
          days[ts.getDate() - 1].records.push(r);
        }
      });

      // Calcola il punteggio per ogni giorno del mese
      return days.map(dayObj => {
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: dayObj.day.toString(),
          score: analysis.score || 0
        };
      });
    }
  }, [view, internalDate, records]);

  // Naviga alla settimana o mese precedente
  const prev = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setInternalDate(d);
  };

  // Naviga alla settimana o mese successiva
  const next = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setInternalDate(d);
  };

  return (
    <div className="Trends">
      {/* Controlli per cambiare periodo e vista */}
      <div className="Trends-controls flex items-center justify-between mb-4">
        <div>
          <button onClick={prev}>←</button>
          <button onClick={next}>→</button>
        </div>
        <div>
          <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'font-bold' : ''}>Settimana</button>
          <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'font-bold' : ''}>Mese</button>
        </div>
        <div>
          {/* Mostra data corrente in formato leggibile a seconda della vista */}
          {view === 'weekly'
            ? internalDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
            : internalDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
          }
        </div>
      </div>

      {/* Grafico a barre che mostra i punteggi del sonno */}
      <BarChart width={800} height={300} data={chartData} className="Trends-chart">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis domain={[0, 100]} label={{ value: 'Punteggio', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value}/100`} />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
