// funzione che conta i minuti per ogni fase e calcola il punteggio

export function analyzeSleep(records) 
{
    const minuteCounts = { Light:0, Deep:0, REM:0, Awake:0, unknown:0 }; //creo un oggetto che mi contiene ogni contatore

    records.forEach(r =>    //mi guarda ogni riga e mi incrementa il contatore corretto
    {
      const s = r.stage;
      if (minuteCounts[s] !== undefined) minuteCounts[s]++;
      else minuteCounts.unknown++;
    });
  
    //regole prese dalla traccia presente su moodle//

    const totalMin = Object.values(minuteCounts).reduce((a,b)=> a+b, 0);
    const hours = totalMin / 60;
    const deepRemMin = minuteCounts.Deep + minuteCounts.REM; //fasi profonde
    const wakeMin = minuteCounts.Awake;
  
    const P_durata = (hours / 8) * 100;
    const P_fase   = (deepRemMin / totalMin) * 100;
    const P_risvegli = (wakeMin / totalMin) * 100;
    const rawScore = (P_durata * 0.5) + (P_fase * 0.5) - P_risvegli;
    const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  
    let interpretation = '';
    if (score >= 80)         interpretation = 'Ottimo!';
    else if (score >= 60)    interpretation = 'Buona ma migliorabile';
    else if (score >= 40)    interpretation = 'Insufficiente devi dormire meglio';
    else                     interpretation = 'Scarsa, dovresti proprio dormire di piú';
  
    return {    //restituisce un oggetto con queste variabili  ad analyzeSleep in App.js
      minuteCounts,
      totalMin,
      hours,
      score,
      interpretation,
      rawData: records
    };
  }
  