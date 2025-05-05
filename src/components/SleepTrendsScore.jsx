import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { analyzeSleep } from '../utils/CalculateScore';

export default function SleepTrendsScore({ records, selectedDate }) {
  const [view, setView] = useState('weekly');
  const [internalDate, setInternalDate] = useState(selectedDate);

  // Aggiorna internalDate se cambia la prop selectedDate
  useEffect(() => {
    setInternalDate(selectedDate);
  }, [selectedDate]);

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const chartData = useMemo(() => {
    if (!records || records.length === 0) return [];

    if (view === 'weekly') {
      const start = getStartOfWeek(internalDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { date: d, records: [] };
      });

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

      return days.map(dayObj => {
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: dayObj.date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
          score: analysis.score || 0
        };
      });
    } else {
      const year = internalDate.getFullYear();
      const month = internalDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1, records: [] }));

      records.forEach(r => {
        const ts = new Date(r.timestamp);
        if (ts.getFullYear() === year && ts.getMonth() === month) {
          days[ts.getDate() - 1].records.push(r);
        }
      });

      return days.map(dayObj => {
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: dayObj.day.toString(),
          score: analysis.score || 0
        };
      });
    }
  }, [view, internalDate, records]);

  const prev = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setInternalDate(d);
  };

  const next = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setInternalDate(d);
  };

  return (
    <div className="Trends">
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
          {view === 'weekly'
            ? internalDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
            : internalDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
          }
        </div>
      </div>

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
