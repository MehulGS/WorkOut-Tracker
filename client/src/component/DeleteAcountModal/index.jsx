import React, { useState } from "react";
import { DeleteAccountAPI } from "../../services/ApiServices";

const DeleteAccountModal = ({ onClose, onDeleted, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DeleteAccountAPI();
      if (onDeleted) {
        onDeleted(data);
      }
      sessionStorage.removeItem("authToken");
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(typeof err === "string" ? err : err?.error || err?.message || "Failed to delete account");
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
          isDark ? "bg-slate-900 border-slate-800 text-slate-50" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Delete account</h2>
        <p
          className={`text-xs sm:text-sm mb-3 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Are you sure you want to permanently delete your account? This action cannot be undone and all your
          data may be lost.
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

        <div className="flex justify-end gap-2 pt-1">
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
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center justify-center ${
              isDark
                ? "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-800/70"
                : "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-400/70"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
