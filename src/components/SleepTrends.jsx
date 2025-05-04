import formatDuration from '../utils/FormatDuration';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
    if (view === 'weekly') {
      const start = getStartOfWeek(selectedDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { date: d, minutes: 0 };
      });
      records.forEach(r => {
        const ts = new Date(r.timestamp);
        days.forEach(dayObj => {
          if (
            ts.getFullYear() === dayObj.date.getFullYear() &&
            ts.getMonth() === dayObj.date.getMonth() &&
            ts.getDate() === dayObj.date.getDate()
          ) {
            dayObj.minutes += 1;
          }
        });
      });
      return days.map(dayObj => ({
        label: dayObj.date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
        minutes: dayObj.minutes
      }));
    } else {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1, minutes: 0 }));
      records.forEach(r => {
        const ts = new Date(r.timestamp);
        if (ts.getFullYear() === year && ts.getMonth() === month) {
          days[ts.getDate() - 1].minutes += 1;
        }
      });
      return days.map(dayObj => ({
        label: dayObj.day.toString(),
        minutes: dayObj.minutes
      }));
    }
  }, [view, selectedDate, records]);

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

      <BarChart width={800} height={300} data={chartData} className="Trends-chart">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          label={{ value: 'Tempo di sonno', angle: -90, position: 'insideLeft' }}
          tickFormatter={(value) => formatDuration(value)}
        />
        <Tooltip
          formatter={(value) => formatDuration(value)}
        />
        <Bar dataKey="minutes" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
