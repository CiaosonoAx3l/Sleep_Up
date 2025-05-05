import { useState, useEffect, useMemo } from 'react'; //hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; //libreria OBBLIGATORIA
import formatDuration from '../utils/FormatDuration';
import { analyzeSleep } from '../utils/CalculateScore';

export default function SleepTrendsCombined({ records, selectedDate }) 
{
  const [view, setView] = useState('weekly'); //vista settimanale o mensile
  const [internalDate, setInternalDate] = useState(selectedDate || new Date()); //serve per il periodo di visualizzazione
  const [mode, setMode] = useState('duration'); //decide quale dato mostrare se duration o score

  useEffect(() => {   //si aggiorna ogni volta che si aggiorna selectedDate
    setInternalDate(selectedDate || new Date());
  }, [selectedDate]);

  const getStartOfWeek = (date) => { //calcola l'inizio della settimana
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handlePrev = () => {  //funzione per recuperare la settimana/mese precedente
    const newDate = new Date(internalDate);
    if (view === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setInternalDate(newDate);
  };

  const handleNext = () => { //funzione per recuperare la settimana/mese successiva
    const newDate = new Date(internalDate);
    if (view === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setInternalDate(newDate);
  };

  const generateChartData = useMemo(() => {   //calcola i 7 giorni e associa record a ciascun giorno 
    if (!records || records.length === 0) return [];

    if (view === 'weekly') { 
      const start = getStartOfWeek(internalDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return { date: d, records: [] };
      });

      records.forEach(r => {  //assegna i record a ciascun giorno della settimana
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

      return days.map(dayObj => {  //calcola il dato per ogni giorno (durata o punteggio)
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: dayObj.date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
          value: mode === 'score' ? analysis.score || 0 : dayObj.records.length,
        };
      });
    } else {
      const year = internalDate.getFullYear();
      const month = internalDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1, records: [] }));

      records.forEach(r => {  //assegna i record ai giorni del mese
        const ts = new Date(r.timestamp);
        if (ts.getFullYear() === year && ts.getMonth() === month) {
          days[ts.getDate() - 1].records.push(r);
        }
      });

      return days.map((dayObj, index) => {  //calcola il dato per ogni giorno del mese
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: (index + 1).toString(),
          value: mode === 'score' ? analysis.score || 0 : dayObj.records.length,
        };
      });
    }
  }, [records, internalDate, view, mode]);

  return (
    <div className="Trends">
      <div className="Trends-controls flex items-center justify-between mb-4">
        <div>
          <div>
            <button onClick={() => setView('weekly')} className={view === 'weekly' ? 'font-bold' : ''}>Settimana</button>
            <button onClick={() => setView('monthly')} className={view === 'monthly' ? 'font-bold' : ''}>Mese</button>
          </div>
          <div>
            <button onClick={() => setMode('duration')} className={mode === 'duration' ? 'font-bold' : ''}>Durata</button>
            <button onClick={() => setMode('score')} className={mode === 'score' ? 'font-bold' : ''}>Punteggio</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="text-lg px-2">←</button>
          <span>
            {view === 'weekly'  //mostra la data attuale in formato settimanale o mensile
              ? internalDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
              : internalDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNext} className="text-lg px-2">→</button>
        </div>
      </div>

      <BarChart margin={{ top: 10, right: 10, left: 30, bottom: 10 }} width={800} height={300} data={generateChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          domain={mode === 'score' ? [0, 100] : undefined}
          label={{
            value: mode === 'score' ? 'Punteggio' : 'Tempo di sonno',
            angle: -90,
            position: 'left',
            offset: '15',
            dy: -50,
          }}
          tickFormatter={mode === 'score' ? undefined : (value) => formatDuration(value)}  //formattazione della durata
        />
        <Tooltip formatter={(value) => mode === 'score' ? `${value}/100` : formatDuration(value)} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
