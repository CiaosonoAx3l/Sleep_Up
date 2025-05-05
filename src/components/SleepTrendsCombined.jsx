// SleepTrendsCombined.jsx
import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import formatDuration from '../utils/FormatDuration';
import { analyzeSleep } from '../utils/CalculateScore';

export default function SleepTrendsCombined({ records, selectedDate }) {
  const [view, setView] = useState('weekly');
  const [internalDate, setInternalDate] = useState(selectedDate);
  const [mode, setMode] = useState('duration');

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

  const generateChartData = useMemo(() => {
    if (!records || records.length === 0) return [];

    if (view === 'weekly') {
      const start = getStartOfWeek(internalDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        d.setHours(0, 0, 0, 0);
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
          value: mode === 'score' ? analysis.score || 0 : dayObj.records.length,
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

      return days.map((dayObj, index) => {
        const analysis = analyzeSleep(dayObj.records);
        return {
          label: (index + 1).toString(),
          value: mode === 'score' ? analysis.score || 0 : dayObj.records.length,
        };
      });
    }
  }, [records, internalDate, view, mode]);

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
          <button onClick={() => setMode('duration')} className={mode === 'duration' ? 'font-bold' : ''}>Durata</button>
          <button onClick={() => setMode('score')} className={mode === 'score' ? 'font-bold' : ''}>Punteggio</button>
        </div>
        <div>
          {view === 'weekly'
            ? internalDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
            : internalDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <BarChart width={800} height={300} data={generateChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          domain={mode === 'score' ? [0, 100] : undefined}
          label={{
            value: mode === 'score' ? 'Punteggio' : 'Tempo di sonno',
            angle: -90,
            position: 'insideLeft'
          }}
          tickFormatter={mode === 'score' ? undefined : (value) => formatDuration(value)}
        />
        <Tooltip formatter={(value) => mode === 'score' ? `${value}/100` : formatDuration(value)} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
}