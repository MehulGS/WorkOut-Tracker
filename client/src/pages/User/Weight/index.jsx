
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { GetWeightLogsAPI } from "../../../services/ApiServices";
import { AddWeightModal } from "../../../component";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WeightLogs = () => {
  const { isDark } = useTheme();

  const [logs, setLogs] = useState([]);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetWeightLogsAPI();
      setLogs(Array.isArray(data?.logs) ? data.logs : []);
      setTrend(data?.trend || null);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load weight logs";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const sorted = [...logs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.map((log, index) => {
      const d = new Date(log.date);
      const label = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return {
        index,
        dateLabel: label,
        weight: log.weight,
      };
    });
  }, [logs]);

  const containerTextColor = isDark ? "text-slate-50" : "text-slate-900";
  const mutedTextColor = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            className={`text-2xl font-semibold ${containerTextColor}`}
          >
            Weight Logs
          </h1>
          <p className={`text-sm ${mutedTextColor}`}>
            Track your weight progress and BMI over time.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
        >
          + Add weight
        </button>
      </div>

      {error && (
        <div
          className={`mb-4 text-xs sm:text-sm rounded-xl px-3 py-2 ${
            isDark
              ? "bg-red-950/50 border border-red-500/40 text-red-200"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <p className={`text-xs ${mutedTextColor}`}>Current weight</p>
          <p className="text-2xl font-semibold mt-1">
            {logs && logs[0]
              ? `${logs[0].weight} kg`
              : "-"}
          </p>
        </div>
        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <p className={`text-xs ${mutedTextColor}`}>Average weight</p>
          <p className="text-2xl font-semibold mt-1">
            {logs && logs.length
              ? `${(
                  logs.reduce((sum, l) => sum + (l.weight || 0), 0) /
                  logs.length
                ).toFixed(1)} kg`
              : "-"}
          </p>
        </div>
        <div className={`rounded-2xl border p-4 ${cardBg}`}>
          <p className={`text-xs ${mutedTextColor}`}>Trend</p>
          {trend ? (
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{trend.value} kg</p>
              <span
                className={`text-xs font-medium ${
                  trend.direction === "up"
                    ? "text-emerald-500"
                    : trend.direction === "down"
                    ? "text-red-500"
                    : mutedTextColor
                }`}
              >
                {trend.direction === "up"
                  ? "↑ up"
                  : trend.direction === "down"
                  ? "↓ down"
                  : "stable"}
              </span>
            </div>
          ) : (
            <p className="text-lg font-semibold mt-1">-</p>
          )}
        </div>
      </div>

      <div
        className={`rounded-2xl border p-4 mb-6 ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-medium ${containerTextColor}`}>
            Weight chart
          </p>
          <p className={`text-xs ${mutedTextColor}`}>
            Last {logs?.length || 0} entries
          </p>
        </div>
        {loading ? (
          <p className={`text-sm ${mutedTextColor}`}>Loading chart...</p>
        ) : logs && logs.length ? (
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid
                  stroke={isDark ? "#1e293b" : "#e2e8f0"}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="index"
                  tick={{ fontSize: 10, fill: isDark ? "#e2e8f0" : "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => chartData?.[value]?.dateLabel ?? ""}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: isDark ? "#e2e8f0" : "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#020617" : "#ffffff",
                    borderRadius: 12,
                    borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke={isDark ? "#22d3ee" : "#0284c7"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className={`text-sm ${mutedTextColor}`}>
            No data yet. Add your first weight entry to see the chart.
          </p>
        )}
      </div>

      <div className={`rounded-2xl border p-4 ${cardBg}`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-medium ${containerTextColor}`}>
            History
          </p>
          <p className={`text-xs ${mutedTextColor}`}>
            {logs?.length || 0} entries
          </p>
        </div>
        {loading ? (
          <p className={`text-sm ${mutedTextColor}`}>Loading logs...</p>
        ) : logs && logs.length ? (
          <ul className="divide-y divide-slate-200/40">
            {logs
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((log, idx) => {
                const date = new Date(log.date);
                const label = date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const time = date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className={containerTextColor}>{label}</p>
                      <p className={`text-xs ${mutedTextColor}`}>{time}</p>
                    </div>
                    <div className="text-right">
                      <p className={containerTextColor}>{log.weight} kg</p>
                      {log.BMI != null && (
                        <p className={`text-xs ${mutedTextColor}`}>
                          BMI: {Number(log.BMI).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className={`text-sm ${mutedTextColor}`}>
            No weight logs yet. Add your first entry.
          </p>
        )}
      </div>

      <AddWeightModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaved={fetchLogs}
        isDark={isDark}
      />
    </div>
  );
};

export default WeightLogs;

