
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  GetNutritionEntriesAPI,
  GetDailyNutritionSummaryAPI,
} from "../../../services/ApiServices";

const Nutrition = () => {
  const { isDark } = useTheme();
  const [entries, setEntries] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [entriesRes, summaryRes] = await Promise.all([
          GetNutritionEntriesAPI(page, 10),
          GetDailyNutritionSummaryAPI(),
        ]);

        if (entriesRes && Array.isArray(entriesRes.items)) {
          setEntries(entriesRes.items);
          setTotalPages(entriesRes.pagination?.totalPages || 1);
        } else if (Array.isArray(entriesRes)) {
          // fallback if API returns plain array (backward compatibility)
          setEntries(entriesRes);
          setTotalPages(1);
        } else {
          setEntries([]);
          setTotalPages(1);
        }

        setDailySummary(Array.isArray(summaryRes) ? summaryRes[0] : summaryRes);
      } catch (err) {
        const message =
          (err && err.message) ||
          (typeof err === "string" ? err : "Failed to load nutrition data");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className={`text-2xl font-semibold mb-2 ${textPrimary}`}>
        Nutrition Tracker
      </h1>

      {error && (
        <div className={`mb-4 text-sm text-red-500`}>
          {error}
        </div>
      )}

      {loading ? (
        <p className={`text-sm ${textSecondary}`}>Loading nutrition data...</p>
      ) : (
        <>
          <div
            className={`mb-6 p-4 rounded-lg border ${cardBg} ${borderColor} flex items-center justify-between`}
          >
            <div>
              <p className={`text-xs uppercase tracking-wide ${textSecondary}`}>
                Today&apos;s Total Calories
              </p>
              <p className={`text-2xl font-semibold ${textPrimary}`}>
                {dailySummary?.totalCalories ?? 0} kcal
              </p>
            </div>
            <div className={`text-xs ${textSecondary}`}>
              {dailySummary?.date && dailySummary.date !== "Invalid Date"
                ? dailySummary.date
                : "Today"}
            </div>
          </div>

          <h2 className={`text-lg font-semibold mb-3 ${textPrimary}`}>
            Today&apos;s Meals
          </h2>

          {entries.length === 0 ? (
            <p className={`text-sm ${textSecondary}`}>
              No meals logged yet for today.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {entries.map((item) => (
                  <div
                    key={item._id}
                    className={`p-3 rounded-lg border ${cardBg} ${borderColor} flex justify-between items-center`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>
                        {item.foodName} ({item.quantity})
                      </p>
                      <p className={`text-xs ${textSecondary}`}>
                        {item.mealType} · {item.time}
                      </p>
                      {item.createdAtIST && (
                        <p className={`text-[11px] ${textSecondary}`}>
                          Added on {item.createdAtIST}
                        </p>
                      )}
                    </div>
                    <div className={`text-sm font-semibold ${textPrimary}`}>
                      {item.calories} kcal
                    </div>
                  </div>
                ))}
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
        </>
      )}
    </div>
  );
};

export default Nutrition;

