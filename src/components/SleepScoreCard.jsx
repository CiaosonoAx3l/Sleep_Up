//questo componente crea solo una frazione di html che prima era creato direttamente in App.js
import formatDuration from '../utils/FormatDuration'; // Import della funzione per formattare il tempo

export default function SleepScoreCard({ analysis }) 
{
  return (
    <div className="SleepCard">
      <h2>Risultati Analisi</h2>
      <p><strong>Punteggio:</strong> {analysis.score}/100</p>
      <p><strong>Interpretazione:</strong> {analysis.interpretation}</p>
      <p><strong>Ore totali dormite:</strong> {formatDuration(analysis.totalMin)}</p> {/* aggiustato */}
      <ul>
        <li>Light: {analysis.minuteCounts.Light} min</li>
        <li>Deep: {analysis.minuteCounts.Deep} min</li>
        <li>REM: {analysis.minuteCounts.REM} min</li>
        <li>Awake: {analysis.minuteCounts.Awake} min</li>
        <li>Unknown: {analysis.minuteCounts.unknown} min</li>
      </ul>
    </div>
  );
}
