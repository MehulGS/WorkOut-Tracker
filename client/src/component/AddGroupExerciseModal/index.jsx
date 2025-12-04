import React, { useState } from "react";
import { CreateGroupExerciseAPI } from "../../services/ApiServices";

const AddGroupExerciseModal = ({ isDark, roomId, bodyPartId, onClose, onAdded }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter an exercise name");
      return;
    }
    if (!roomId || !bodyPartId) {
      setError("Missing group or body part id");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await CreateGroupExerciseAPI(roomId, {
        bodyPartId,
        name: name.trim(),
      });
      if (onAdded) {
        onAdded(data);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.error || err?.message || "Failed to add exercise to group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6 ${
        isDark ? "bg-black/60" : "bg-slate-900/40"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-4 sm:p-6 ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-50"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Add Exercise</h2>
        <p
          className={`text-xs sm:text-sm mb-3 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Create a new exercise for this group body part.
        </p>

        {error && (
          <div
            className={`mb-3 text-xs sm:text-sm rounded-xl px-3 py-2 ${
              isDark
                ? "bg-red-950/50 border border-red-500/40 text-red-200"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label
              className={`block text-xs sm:text-sm font-medium ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              Exercise name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm border outline-none bg-transparent ${
                isDark
                  ? "border-slate-700 text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                  : "border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
              }`}
              placeholder="e.g. Dumbbell Bench Press"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                isDark
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center justify-center ${
                isDark
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-emerald-800/70"
                  : "bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-emerald-400/70"
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupExerciseModal;
