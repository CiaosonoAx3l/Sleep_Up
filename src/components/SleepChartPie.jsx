import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
  light: "#8884d8",
  deep: "#82ca9d",
  rem: "#ffc658",
  awake: "#ff7f7f",
};

const SleepChartPie = ({ data }) => {
  // Conta il numero di occorrenze di ogni fase
  const stageCounts = data.reduce((acc, entry) => {
    acc[entry.stage] = (acc[entry.stage] || 0) + 1;
    return acc;
  }, {});

  // Trasforma in array per il grafico
  const chartData = Object.keys(stageCounts).map((stage) => ({
    name: stage,
    value: stageCounts[stage],
  }));

  return (
    <section>
    <div className="piechart">
      <h2 className="text-xl font-semibold text-center mb-4">Distribuzione delle fasi del sonno</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#ccc"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
    </section>
  );
};

export default SleepChartPie;
