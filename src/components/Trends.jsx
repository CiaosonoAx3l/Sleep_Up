import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import formatDuration from "../utils/FormatDuration";
import { analyzeSleep } from "../utils/CalculateScore";
import '../index.css';

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getNightInterval(dayDate) {
  const start = new Date(dayDate);
  start.setDate(start.getDate() - 1);
  start.setHours(20, 0, 0, 0);
  const end = new Date(dayDate);
  end.setHours(12, 0, 0, 0);
  return { start, end };
}

export default function Trends({ records, initialDate }) {
  const [view, setView] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(() =>
    initialDate ? new Date(initialDate) : new Date()
  );
  const [mode, setMode] = useState("duration");

  useEffect(() => {
    if (initialDate) {
      setCurrentDate(new Date(initialDate));
    }
  }, [initialDate]);

  const handlePrev = () => {
    setCurrentDate((date) =>
      view === "weekly" ? addDays(date, -7) : addMonths(date, -1)
    );
  };
  const handleNext = () => {
    setCurrentDate((date) =>
      view === "weekly" ? addDays(date, 7) : addMonths(date, 1)
    );
  };

  const chartData = useMemo(() => {
    if (!records || records.length === 0) return [];

    if (view === "weekly") {
      const start = startOfWeek(currentDate);
      const days = Array.from({ length: 7 }, (_, i) => {
        const dayDate = addDays(start, i);
        return {
          date: dayDate,
          label: dayDate.toLocaleDateString("it-IT", {
            weekday: "short",
            day: "numeric",
          }),
          records: [],
        };
      });

      days.forEach(day => {
        const { start: nightStart, end: nightEnd } = getNightInterval(day.date);
        day.records = records.filter(r => {
          const ts = new Date(r.timestamp);
          return ts >= nightStart && ts <= nightEnd;
        });
      });

      return days.map(day => {
        const analysis = analyzeSleep(day.records);
        return {
          label: day.label,
          value: mode === "score" ? analysis.score || 0 : analysis.totalMin || 0,
        };
      });

    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const days = Array.from({ length: daysInMonth }, (_, i) => {
        const dayDate = new Date(year, month, i + 1);
        return {
          date: dayDate,
          label: (i + 1).toString(),
          records: [],
        };
      });

      days.forEach(day => {
        const { start: nightStart, end: nightEnd } = getNightInterval(day.date);
        day.records = records.filter(r => {
          const ts = new Date(r.timestamp);
          return ts >= nightStart && ts <= nightEnd;
        });
      });

      return days.map(day => {
        const analysis = analyzeSleep(day.records);
        return {
          label: day.label,
          value: mode === "score" ? analysis.score || 0 : analysis.totalMin || 0,
        };
      });
    }
  }, [records, currentDate, view, mode]);

  return (
    <div className="Trends p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between mb-4 gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setView("weekly")}
            className="toggle-btn"
            aria-pressed={view === "weekly"}
          >
            Settimana
          </button>
          <button
            onClick={() => setView("monthly")}
            className="toggle-btn"
            aria-pressed={view === "monthly"}
          >
            Mese
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode("duration")}
            className="toggle-btn"
            aria-pressed={mode === "duration"}
          >
            Durata
          </button>
          <button
            onClick={() => setMode("score")}
            className="toggle-btn"
            aria-pressed={mode === "score"}
          >
            Punteggio
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="nav-btn"
            aria-label="Precedente"
          >
            ←
          </button>
          <span className="period-label">
            {view === "weekly"
              ? (() => {
                  const start = startOfWeek(currentDate);
                  const end = addDays(start, 6);
                  return `${start.toLocaleDateString("it-IT")} - ${end.toLocaleDateString(
                    "it-IT"
                  )}`;
                })()
              : currentDate.toLocaleDateString("it-IT", {
                  month: "long",
                  year: "numeric",
                })}
          </span>
          <button
            onClick={handleNext}
            className="nav-btn"
            aria-label="Successivo"
          >
            →
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <p className="text-center text-gray-500">
          Nessun dato disponibile per questo periodo.
        </p>
      ) : (
        <BarChart
          width={800}
          height={400}
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          role="img"
          aria-label={`Grafico a barre della ${
            mode === "score" ? "punteggio" : "durata"
          } del sonno per il periodo selezionato`}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis
            domain={mode === "score" ? [0, 100] : undefined}
            label={{
              value: mode === "score" ? "Punteggio" : "Minuti dormiti",
              angle: -90,
              position: "insideLeft",
              dy: 60,
            }}
            tickFormatter={mode === "score" ? undefined : formatDuration}
          />
          <Tooltip
            formatter={(value) =>
              mode === "score" ? `${value}/100` : formatDuration(value)
            }
          />
          <Bar dataKey="value" fill={mode === "score" ? "#82ca9d" : "#8884d8"} />
        </BarChart>
      )}
    </div>
  );
}
