import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ResponsiveContainer } from "recharts";


const sleepStageMap = {
  awake: 0,
  light: 1,
  rem: 2,
  deep: 3,
};

const stageLabels = ['Awake', 'Light', 'REM', 'Deep'];

function SleepChartTimeline({ data }) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    stageValue: sleepStageMap[d.stage.toLowerCase()] ?? 4, // rende robusto contro "Deep", "deep", ecc.
  }));

  return (
    <section>
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-2">Andamento del sonno</h3>
      <ResponsiveContainer width="100%" aspect={2.625}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: 'Orario',
            position: 'insideBottomRight',
            offset: -5,
          }}
        />
        <YAxis
          dataKey="stageValue"
          type="number"
          domain={[0, 3]}
          tickFormatter={(val) => stageLabels[val]}
          tickCount={4}
          label={{ value: 'Fase', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value) => stageLabels[value]}
          labelFormatter={(label) => `Orario: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="stageValue"
          stroke="#8884d8"
          dot={true}
          strokeWidth={4}
        />
       </LineChart>
       </ResponsiveContainer>
    </div>
    </section>
  );
}

export default SleepChartTimeline;
