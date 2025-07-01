import React from "react";

export default function Tips({ analysis }) {
  const tips = [];
  if (analysis.hours < 7) tips.push('Cerca di dormire almeno 7–8 ore!');
  if (analysis.minuteCounts.Awake > 30) tips.push('Riduci le interruzioni notturne (es. rumore, stress, luci).');
  if ((analysis.minuteCounts.Deep + analysis.minuteCounts.REM) / analysis.totalMin < 0.25) 
    tips.push('Non studiare di notte, evita caffeina e la luce blu prima di dormire.');

  return (
    <div className="consigli">
      <h3 className="Tips_title">Consigli</h3>
      <p><strong>Risultato:</strong> {analysis.interpretation}</p>

      <p>Ecco qualche piccolo consiglio:</p>
      <ul className="Tips_list">
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
