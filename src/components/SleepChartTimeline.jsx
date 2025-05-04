import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; //libreria OBBLIGATORIA


const sleepStageMap = {   // mappa le fasi del sonno in valori numerici per rappresentarle sull'asse Y
  Awake: 0,
  REM: 1,
  Light: 2,
  Deep: 3,
};


const stageLabels = ['Awake', 'REM', 'Light', 'Deep'];    // visualizza le label invece dei numeri

function SleepChartTimeline({ data })  //riceve in input la lista di timestamps e stage
{
  
  const chartData = data.map((d) => (     // Trasforma i dati: timestamp e stage → timestamp e valore numerico
  {
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hour12: false}),
    stageValue: sleepStageMap[d.stage] ?? 4, // default a 4 se non riconosciuto cosi' da non modificare il grafico
  }));

  return (
    <div className="my-4">
      <h3 className="font-semibold">Andamento delle Fasi del Sonno</h3>
      <LineChart width={600} height={350} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />   {/* aggiunge una griglia per migliorare la leggibilita' dei dati */}
        <XAxis dataKey="time" label={{ value: 'Orario', position: 'insideBottomRight', offset: -5 }} /> {/* visualizza gli orari */}
        <YAxis
          dataKey="stageValue" //prende i valori da stageValue
          type="number"
          domain={[0, 3]} //intervallo da 0 a 3 che rapresentano gli stage
          tickFormatter={(val) => stageLabels[val]} //usa l'etichette dall'array stageLabels
          tickCount={4} //impone che ci siano solo 4 valori e non 5 (per evitare unknown)
          label={{ value: 'Fase', angle: -90, position: 'insideLeft' }} //visualizza etichetta verticale
        /> 
        <Tooltip //mostra il box al passaggio del mouse
          formatter={(value) => stageLabels[value]} //numero in etichetta 
          labelFormatter={(label) => `Orario: ${label}`} //formato di orario: h:m
        />
        <Line type="monotone" dataKey="stageValue" stroke="#8884d8" dot={true} strokeWidth={4}/> {/* linea principale: spessa, morbida, colore viola e pallini visibili */}
      </LineChart>
    </div>
  );
}

export default SleepChartTimeline;