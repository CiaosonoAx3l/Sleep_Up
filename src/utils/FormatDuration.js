export default function formatDuration(minutes) // funzione per formattare il tempo da 6.5 a 6 ore e 30 minuti
{
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}
  