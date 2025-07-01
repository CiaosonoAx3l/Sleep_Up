import React from "react";
import formatDuration from '../utils/FormatDuration';

export default function SleepScoreCard({ analysis }) {
  return (
    <section>
    <div className="SleepCard">
      <h2 className="text-xl font-semibold mb-2">Risultati Analisi</h2>

      <p><strong>Ore totali dormite:</strong> {formatDuration(analysis.totalMin)}</p>

      {/*<p><strong>Punteggio:</strong> {analysis.score}/100</p>*/}
      {/* Debug info se vuoi attivarla */}
      {/* <ul>
        <li>Light: {analysis.minuteCounts.Light} min</li>
        <li>Deep: {analysis.minuteCounts.Deep} min</li>
        <li>REM: {analysis.minuteCounts.REM} min</li>
        <li>Awake: {analysis.minuteCounts.Awake} min</li>
        <li>Unknown: {analysis.minuteCounts.unknown} min</li>
      </ul> */}
      
    </div>
    </section>
  );
}
