
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import {
  GetNutritionEntriesAPI,
  GetDailyNutritionSummaryAPI,
  AddNutritionAPI,
} from "../../../services/ApiServices";

const Nutrition = () => {
  const { isDark } = useTheme();
  const [entries, setEntries] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    foodName: "",
    calories: "",
    quantity: "",
    time: "",
    mealType: "lunch",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (pageToLoad = page) => {
    try {
      setLoading(true);
      setError("");

      const [entriesRes, summaryRes] = await Promise.all([
        GetNutritionEntriesAPI(pageToLoad, 10),
        GetDailyNutritionSummaryAPI(),
      ]);

      if (entriesRes && Array.isArray(entriesRes.items)) {
        setEntries(entriesRes.items);
        setTotalPages(entriesRes.pagination?.totalPages || 1);
      } else if (Array.isArray(entriesRes)) {
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

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await AddNutritionAPI({
        foodName: form.foodName,
        calories: Number(form.calories),
        quantity: Number(form.quantity),
        time: form.time,
        mealType: form.mealType,
      });
      setIsModalOpen(false);
      setForm({ foodName: "", calories: "", quantity: "", time: "", mealType: "lunch" });
      await fetchData(1);
      setPage(1);
    } catch (err) {
      const message =
        (err && err.message) ||
        (typeof err === "string" ? err : "Failed to add nutrition entry");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className={`text-2xl font-semibold ${textPrimary}`}>
          Nutrition Tracker
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Nutrition
        </button>
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`w-full max-w-md rounded-lg border ${cardBg} ${borderColor} p-4`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-lg font-semibold ${textPrimary}`}>Add Nutrition</h2>
              <button
                type="button"
                onClick={() => !submitting && setIsModalOpen(false)}
                className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                  Food name
                </label>
                <input
                  type="text"
                  name="foodName"
                  value={form.foodName}
                  onChange={handleChange}
                  required
                  className="w-full rounded border px-2 py-1 text-sm bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                    Calories
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={form.calories}
                    onChange={handleChange}
                    required
                    className="w-full rounded border px-2 py-1 text-sm bg-transparent"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className="w-full rounded border px-2 py-1 text-sm bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  placeholder="e.g. 2:00 PM"
                  required
                  className="w-full rounded border px-2 py-1 text-sm bg-transparent"
                />
                <p className={`mt-1 text-[11px] ${textSecondary}`}>
                  Example: <span className="font-mono">2:00 PM</span>
                </p>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${textSecondary}`}>
                  Meal type
                </label>
                <select
                  name="mealType"
                  value={form.mealType}
                  onChange={handleChange}
                  required
                  className="w-full rounded border px-2 py-1 text-sm bg-transparent"
                >
                  <option value="breakfast">breakfast</option>
                  <option value="mid_meal">mid_meal</option>
                  <option value="lunch">lunch</option>
                  <option value="evening_snack">evening_snack</option>
                  <option value="dinner">dinner</option>
                  <option value="pre_workout">pre_workout</option>
                  <option value="post_workout">post_workout</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 text-sm">
                <button
                  type="button"
                  onClick={() => !submitting && setIsModalOpen(false)}
                  className="px-3 py-1 rounded border"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;

