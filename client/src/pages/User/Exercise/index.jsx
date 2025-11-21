
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetExerciseBodyPartsAPI } from "../../../services/ApiServices";
import {AddBodyPartModal} from "../../../component";

const Exercise = () => {
  const { isDark } = useTheme();
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPartId, setSelectedBodyPartId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchBodyParts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GetExerciseBodyPartsAPI();
      setBodyParts(Array.isArray(data) ? data : data?.bodyParts || []);
    } catch (err) {
      const message = err?.message || "Failed to load exercise body parts";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBodyParts();
  }, [fetchBodyParts]);

  const filteredBodyParts = useMemo(() => {
    if (selectedBodyPartId === "all") return bodyParts;
    return bodyParts.filter((bp) => bp._id === selectedBodyPartId);
  }, [bodyParts, selectedBodyPartId]);

  useEffect(() => {
    setPage(1);
  }, [selectedBodyPartId, bodyParts]);

  const totalPages = Math.max(
    1,
    Math.ceil((filteredBodyParts ? filteredBodyParts.length : 0) / itemsPerPage)
  );

  const paginatedBodyParts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBodyParts.slice(start, end);
  }, [filteredBodyParts, page]);

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1
            className={`text-2xl font-semibold ${textPrimary}`}
          >
            Exercise Body Parts
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Browse body parts / muscles and see how many exercises are linked to each.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Add Body Part / Muscle
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <label className={`text-sm font-medium ${textSecondary}`}>
          Filter by body part
        </label>
        <select
          value={selectedBodyPartId}
          onChange={(e) => setSelectedBodyPartId(e.target.value)}
          className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100"
              : "bg-white border-slate-300 text-slate-900"
          }`}
        >
          <option value="all">All body parts</option>
          {bodyParts.map((bp) => (
            <option key={bp._id} value={bp._id}>
              {bp.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading body parts...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && filteredBodyParts.length === 0 && (
        <p className={`text-sm ${textSecondary}`}>
          No body parts found.
        </p>
      )}

      {!loading && !error && filteredBodyParts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {paginatedBodyParts.map((bp) => {
              const exercises = Array.isArray(bp.exercises) ? bp.exercises : [];
              return (
                <Link
                  to={`/exercise/${bp._id}/exercises`}
                  key={bp._id}
                  className="block group"
                >
                  <div
                    className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm flex flex-col justify-between group-hover:border-emerald-500 group-hover:shadow-md transition`}
                  >
                    <div>
                      <h2 className={`text-lg font-semibold mb-1 ${textPrimary}`}>
                        {bp.name}
                      </h2>
                      <p className={`text-xs ${textSecondary}`}>
                        Body part / muscle group
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-sm font-medium ${textPrimary}`}>
                        {exercises.length} exercise{exercises.length === 1 ? "" : "s"}
                      </span>
                      <span className="text-xs text-emerald-500 group-hover:text-emerald-400">
                        View exercises →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs">
            <button
              type="button"
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Previous
            </button>

            <span className={`${textSecondary}`}>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showAddModal && (
        <AddBodyPartModal
          isDark={isDark}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            fetchBodyParts();
          }}
        />
      )}
    </div>
  );
};

export default Exercise;

