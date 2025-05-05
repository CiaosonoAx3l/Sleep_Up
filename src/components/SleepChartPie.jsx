import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; //libreria OBBLIGATORIA
import formatDuration from '../utils/FormatDuration'; //funzione per trasformare: 6.5 ore in 6.30 minuti

export default function SleepChartPie({ data }) 
{
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f']; //colori da usare rispettivamente per Light, Deep, REM, Awake

  const chartData = [                                           //crea un array con nome della fase e minuti
    { name: 'Light', value: data.minuteCounts.Light },
    { name: 'Deep', value: data.minuteCounts.Deep },
    { name: 'REM', value: data.minuteCounts.REM },
    { name: 'Awake', value: data.minuteCounts.Awake }
  ];


  return (
    <div className="PieCharts">
      <hr className="separator_linePC" />
      <h2 className="PieCharts_title">Fasi del sonno</h2>
      <PieChart width={660} height={500}>
        {/* Componente Pie che genera la torta */}
        <Pie
          data={chartData}  //dati da visualizzare nel grafico
          cx="50%"          //posizione x (orizontale) del grafico
          cy="50%"          //posizione y (verticale) del grafico a torta
          outerRadius={200} //raggio 
          stroke= 'none'
          label={({ name, value }) => `${name}: ${formatDuration(value)}`} //etichetta creata dal value
          dataKey="value" //chiave visualizzabile in base al valore a cui si riferisce
        >
          {chartData.map((entry, index) => (            
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />     //assegnazione dei colori
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatDuration(value)} // Formattazione del valore per il tooltip (es. 30 min)
        />
        <Legend /> {/*crea la legenda in basso*/}
      </PieChart>
    </div>
  );
}
