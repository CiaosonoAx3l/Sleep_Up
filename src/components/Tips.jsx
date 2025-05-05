//componente che prende il risultato della funzione analyzeSleep() e genera un consiglio
export default function Tips({ analysis }) 
{
  const tips = [];
  if (analysis.hours < 7) tips.push('Cerca di dormire almeno 7–8 ore.'); //se ha meno di 7 ore aggiunge un consiglio per dormmire di piu'
  if (analysis.minuteCounts.Awake > 30) tips.push('Riduci le interruzioni notturne (es. rumore, stress, luci).'); // genera un consiglio se rimani sveglio piu' di un tot. 
  if ((analysis.minuteCounts.Deep + analysis.minuteCounts.REM) / analysis.totalMin < 0.25) 
    tips.push('non studiare di notte, evita caffeina e la luce blu prima di dormire.'); // genera un consiglio se le fasi profonde sono meno del 25% 

  return (
    <div className="Tips">
      <h3 className="Tips-title">Consigli</h3>
      <p><strong>Risultato:</strong> {analysis.interpretation}</p>

      <p>Ecco qualche piccolo consiglio:</p>
      <ul className="Tips-list">
        {tips.map((t,i) => <li key={i}>{t}</li>)} {/*  usa funzione map() per generare una lista di consigli */}
      </ul>
    </div>
  );
}
  