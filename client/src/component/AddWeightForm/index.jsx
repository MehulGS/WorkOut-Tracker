import React, { useState } from "react";
import { AddWeightAPI } from "../../services/ApiServices";

const AddWeightModal = ({ isOpen, onClose, onSaved, isDark }) => {
  const [weightInput, setWeightInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!weightInput) {
      setError("Please enter a valid weight.");
      return;
    }

    const payload = {
      weight: parseFloat(weightInput),
    };

    setSaving(true);
    try {
      await AddWeightAPI(payload);
      if (onSaved) {
        await onSaved();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save weight";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const mutedTextColor = isDark ? "text-slate-300" : "text-slate-600";

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
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Add weight</h2>
        <p className={`text-xs sm:text-sm mb-3 ${mutedTextColor}`}>
          Enter your current weight.
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
              className={
                isDark
                  ? "block text-xs font-medium text-slate-300"
                  : "block text-xs font-medium text-slate-600"
              }
            >
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className={
                isDark
                  ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              }
              required
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
              disabled={saving}
              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center justify-center bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWeightModal;
