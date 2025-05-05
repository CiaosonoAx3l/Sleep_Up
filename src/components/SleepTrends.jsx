//componente che permettere di visualiazzire i trend del sonno
import formatDuration from '../utils/FormatDuration'; // import della funzione per formattare il tempo
import { useState, useMemo } from 'react'; //hook
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; //libreria OBBLIGATORIA


export default function SleepTrends({ records, selectedDate }) 
{
  const [view, setView] = useState('weekly'); //stato settimanale o mensile
  const [internalDate, setInternalDate] = useState(selectedDate); //stato della data attuale

  const getStartOfWeek = (date) => { //funzione per iniziare la settimana da lunedi'
    const d = new Date(date);
    const day = d.getDay(); // giorno della settimana (0 = domenica)
    const diff = (day + 6) % 7; // quanto sottrarre per arrivare a lunedì
    d.setDate(d.getDate() - diff); // imposta la data a lunedì
    d.setHours(0, 0, 0, 0); // azzera ore, minuti, secondi
    return d;
  };

  const chartData = useMemo(() => {     // calcola i dati da visualizzare nel grafico in base alla vista
    if (!records || records.length === 0) return [];

    if (view === 'weekly') 
      { //crea un array di 7 giorni
      const start = getStartOfWeek(internalDate);
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i); // imposta ogni giorno della settimana
        d.setHours(0, 0, 0, 0);
        return { date: d, minutes: 0 };
      });

      records.forEach(r => { //conta i minuti in un giorno
        const ts = new Date(r.timestamp);
        const tsDate = new Date(ts);
        tsDate.setHours(0, 0, 0, 0);

        // Calcola l'indice del giorno nella settimana corrente
        const index = Math.floor((tsDate - start) / (1000 * 60 * 60 * 24));
        if (index >= 0 && index < 7) 
        {
          days[index].minutes += 1; // Aggiunge un minuto per ogni record
        }
      });

      // Ritorna i dati formattati per il grafico
      return days.map(dayObj => ({
        label: dayObj.date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
        minutes: dayObj.minutes
      }));
    } 
    else 
    {
      // Vista mensile
      const year = internalDate.getFullYear();
      const month = internalDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Crea array di giorni del mese
      const days = Array.from({ length: daysInMonth }).map((_, i) => ({ day: i + 1, minutes: 0 }));

      // Conta i minuti di sonno per ogni giorno del mese
      records.forEach(r => {
        const ts = new Date(r.timestamp);
        if (ts.getFullYear() === year && ts.getMonth() === month) {
          days[ts.getDate() - 1].minutes += 1;
        }
      });

      // Ritorna i dati formattati per il grafico
      return days.map(dayObj => ({
        label: dayObj.day.toString(),
        minutes: dayObj.minutes
      }));
    }
  }, [view, internalDate, records]);

  // Navigazione alla settimana/mese precedente
  const prev = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setInternalDate(d); // aggiorna la data corrente
  };

  // Navigazione alla settimana/mese successiva
  const next = () => {
    const d = new Date(internalDate);
    if (view === 'weekly') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setInternalDate(d); // aggiorna la data corrente
  };

  return (
    <div className="Trends">
      {/* Controlli per la navigazione e la selezione della vista */}
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
          {/* Mostra la data corrente in formato leggibile */}
          {view === 'weekly'
            ? internalDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'numeric' })
            : internalDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
          }
        </div>
      </div>

      {/*inizio grafico*/}
      <BarChart width={800} height={300} data={chartData} className="Trends-chart">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          label={{ value: 'Tempo di sonno', angle: -90, position: 'insideLeft' }}
          tickFormatter={(value) => formatDuration(value)}
        />
        <Tooltip formatter={(value) => formatDuration(value)} />
        <Bar dataKey="minutes" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
