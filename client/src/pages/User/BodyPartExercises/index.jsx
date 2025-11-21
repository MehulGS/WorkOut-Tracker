import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetBodyPartExercisesAPI } from "../../../services/ApiServices";
import { AddExerciseModal } from "../../../component";

const BodyPartExercises = () => {
  const { isDark } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [bodyPartName, setBodyPartName] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchExercises = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await GetBodyPartExercisesAPI(id);
      const list = Array.isArray(data?.exercises) ? data.exercises : Array.isArray(data) ? data : [];
      setExercises(list);
      if (data?.bodyPartName || data?.name) {
        setBodyPartName(data.bodyPartName || data.name);
      }
    } catch (err) {
      const message = err?.message || "Failed to load exercises";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const filteredExercises = useMemo(() => {
    if (selectedExerciseId === "all") return exercises;
    return exercises.filter((ex) => ex._id === selectedExerciseId);
  }, [exercises, selectedExerciseId]);

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>
            {bodyPartName || "Exercises"}
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Exercises for this body part / muscle group.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Add Exercise
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <label className={`text-sm font-medium ${textSecondary}`}>
          Filter by exercise
        </label>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-300 text-slate-900"
          }`}
        >
          <option value="all">All exercises</option>
          {exercises.map((ex) => (
            <option key={ex._id} value={ex._id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading exercises...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && filteredExercises.length === 0 && (
        <p className={`text-sm ${textSecondary}`}>
          No exercises found.
        </p>
      )}

      {!loading && !error && filteredExercises.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {filteredExercises.map((ex) => (
            <div
              key={ex._id}
              className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm flex flex-col justify-between`}
            >
              <div>
                <h2 className={`text-lg font-semibold mb-1 ${textPrimary}`}>
                  {ex.name}
                </h2>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/exercise/${ex._id}/history`)}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                >
                  Workout history
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddExerciseModal
          isDark={isDark}
          bodyPartId={id}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            fetchExercises();
          }}
        />
      )}
    </div>
  );
};

export default BodyPartExercises;
