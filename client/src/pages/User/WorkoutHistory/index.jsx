import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetExerciseHistoryAPI, LogExerciseSetAPI } from "../../../services/ApiServices";

const WorkoutHistory = () => {
  const { isDark } = useTheme();
  const { exerciseId } = useParams();

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weightKg, setWeightKg] = useState(0);
  const [reps, setReps] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!exerciseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await GetExerciseHistoryAPI(exerciseId);
      setHistory(data);
    } catch (err) {
      const message = err?.message || "Failed to load workout history";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAddSet = async (e) => {
    e.preventDefault();
    if (!exerciseId) return;
    if (!weightKg || !reps) return;
    try {
      setSaving(true);
      setError(null);
      await LogExerciseSetAPI({ exerciseId, weightKg: Number(weightKg), reps: Number(reps) });
      setWeightKg(0);
      setReps(0);
      setShowAddModal(false);
      fetchHistory();
    } catch (err) {
      const message = err?.message || "Failed to add set";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";
  const inputBg = isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900";

  const setsByDate = Array.isArray(history?.sets) ? history.sets : [];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getSuffix = (n) => {
      if (n >= 11 && n <= 13) return "th";
      const last = n % 10;
      if (last === 1) return "st";
      if (last === 2) return "nd";
      if (last === 3) return "rd";
      return "th";
    };

    return `${day}${getSuffix(day)} ${month} ${year}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>
            {history?.exerciseName || "Workout history"}
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            {history?.bodyPartName ? `Body part: ${history.bodyPartName}` : ""}
          </p>
          {history && (
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Total sets: {history.setsCount || 0}
              {" · "}
              Avg weight: {history.averageWeightKg ? history.averageWeightKg.toFixed(1) : 0} kg
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Add set
        </button>
      </div>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading workout history...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (!setsByDate || setsByDate.length === 0) && (
        <p className={`text-sm ${textSecondary}`}>
          No sets logged yet.
        </p>
      )}

      {!loading && !error && setsByDate && setsByDate.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {setsByDate.map((day) => (
            <div
              key={day.date}
              className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm flex flex-col justify-between`}
            >
              <div>
                <h2 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
                  {formatDate(day.date)}
                </h2>
                <ul className="space-y-1 text-sm">
                  {Array.isArray(day.sets) && day.sets.map((set) => (
                    <li key={set.setNumber} className={`${textSecondary}`}>
                      Set {set.setNumber}: {set.weightKg} kg × {set.reps} reps
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg w-full max-w-sm p-4`}>
            <h2 className={`text-lg font-semibold mb-3 ${textPrimary}`}>
              Add set
            </h2>
            <form onSubmit={handleAddSet} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={`w-full px-2 py-1.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${inputBg}`}
                  placeholder="e.g. 12.5"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className={`w-full px-2 py-1.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${inputBg}`}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (saving) return;
                    setShowAddModal(false);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {saving ? "Adding..." : "Save set"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
