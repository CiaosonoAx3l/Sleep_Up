//NON FUNZIONANTE

import formatDuration from '../utils/FormatDuration.js';
import { analyzeSleep  } from '../utils/CalculateScore.js';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function SleepTrends({ records }) {
  const [view, setView] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());

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

    const dataMap = {};
    const start = view === 'weekly'
      ? getStartOfWeek(selectedDate)
      : new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    const length = view === 'weekly'
      ? 7
      : new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < length; i++) {
      const d = new Date(start);
      if (view === 'weekly') {
        d.setDate(start.getDate() + i);
      } else {
        d.setDate(i + 1);
      }
      const key = d.toISOString().slice(0, 10);
      dataMap[key] = { date: d, records: [] };
    }

    records.forEach(r => {
      const ts = new Date(r.timestamp);
      const key = ts.toISOString().slice(0, 10);
      if (dataMap[key]) {
        dataMap[key].records.push(r);
      }
    });

    return Object.entries(dataMap).map(([key, { date, records }]) => {
      const label = view === 'weekly'
        ? date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' })
        : date.getDate().toString();

      const filtered = records.filter(r => r.state !== 'AWAKE');
      const score = records.length > 0 ? analyzeSleep(records) : 0;

      return {
        label,
        score: Math.round(score),
        minutes: filtered.length,
      };
    });
  }, [view, selectedDate, records]);

  const averageScore = useMemo(() => {
    const scores = chartData.map(d => d.score);
    const valid = scores.filter(s => !isNaN(s));
    return valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
  }, [chartData]);

  const averageMinutes = useMemo(() => {
    const minutes = chartData.map(d => d.minutes);
    const valid = minutes.filter(m => !isNaN(m));
    return valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0;
  }, [chartData]);

  const prev = () => {
    const d = new Date(selectedDate);
    if (view === 'weekly') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setSelectedDate(d);
  };

  const next = () => {
    const d = new Date(selectedDate);
    if (view === 'weekly') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setSelectedDate(d);
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
            ? selectedDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
            : selectedDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
          }
        </div>
      </div>

      <div className="mb-2 font-semibold">Media punteggio: {averageScore}/100</div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value}/100`} />
          <Bar dataKey="score" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 mb-2 font-semibold">
        Media ore di sonno: {formatDuration(averageMinutes)}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 600]} tickFormatter={(v) => formatDuration(v)} />
          <Tooltip formatter={(value) => formatDuration(value)} />
          <Bar dataKey="minutes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}