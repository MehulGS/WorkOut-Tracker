import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { ProfileAPI } from "../../../services/ApiServices";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DeleteAccountModal, EditProfileForm } from "../../../component";

const Profile = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProfileAPI();
        setProfile(data);
      } catch (err) {
        setError(typeof err === "string" ? err : err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const weightData = (profile?.weightChart || []).map((item) => {
    const dateObj = new Date(item.date);
    return {
      date: dateObj,
      label: dateObj.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      weight: item.weight,
      BMI: item.BMI,
    };
  });

  const directionLabel =
    profile?.weightTrend?.direction === "up"
      ? "Increasing"
      : profile?.weightTrend?.direction === "down"
      ? "Decreasing"
      : "Stable";

  return (
    <div
      className={`min-h-[calc(100vh-80px)] w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8 ${
        isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Profile Overview
            </h1>
            <p
              className={`mt-1 text-sm sm:text-base ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Personal stats, progress trends, and daily gym snapshot.
            </p>
          </div>
        </div>

        {loading && (
          <div
            className={`flex items-center justify-center rounded-2xl border px-4 py-10 sm:py-12 ${
              isDark
                ? "border-slate-800 bg-slate-900/60"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm sm:text-base">Loading your profile...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            className={`rounded-2xl border px-4 py-4 text-sm sm:text-base ${
              isDark
                ? "border-red-500/40 bg-red-950/40 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {!loading && profile && (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 sm:gap-6">
              <div
                className={`rounded-2xl border p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center text-2xl font-semibold text-white">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-semibold leading-tight">
                      {profile.name}
                    </h2>
                    <p
                      className={`text-xs sm:text-sm break-all ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {profile.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
                          isDark
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        BMI {profile.BMI}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          isDark
                            ? "bg-sky-500/15 text-sky-200 border border-sky-500/40"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}
                      >
                        Gym time: {profile.gymTiming || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2">
                  <div
                    className={`rounded-xl px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1.5 ${
                      isDark
                        ? "bg-slate-950/60 border border-slate-800"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Age
                    </span>
                    <span className="text-lg sm:text-xl font-semibold">
                      {profile.age}
                    </span>
                    {profile.dateOfBirth && (
                      <span
                        className={`text-[11px] sm:text-xs ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        DOB: {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </span>
                    )}
                    {profile.gender && (
                      <span
                        className={`text-[11px] sm:text-xs ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Gender: {String(profile.gender).toLowerCase()}
                      </span>
                    )}
                  </div>
                  <div
                    className={`rounded-xl px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1.5 ${
                      isDark
                        ? "bg-slate-950/60 border border-slate-800"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Height
                    </span>
                    <span className="text-lg sm:text-xl font-semibold">
                      {profile.height} cm
                    </span>
                  </div>
                  <div
                    className={`rounded-xl px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1.5 ${
                      isDark
                        ? "bg-slate-950/60 border border-slate-800"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Weight
                    </span>
                    <span className="text-lg sm:text-xl font-semibold">
                      {profile.weight} kg
                    </span>
                  </div>
                  <div
                    className={`rounded-xl px-3 py-3 sm:px-4 sm:py-4 flex flex-col gap-1.5 ${
                      isDark
                        ? "bg-slate-950/60 border border-slate-800"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[11px] uppercase tracking-wide ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Weight trend
                    </span>
                    <span className="text-sm sm:text-base font-medium flex items-center gap-1.5">
                      <span
                        className={
                          profile.weightTrend?.direction === "up"
                            ? "text-rose-500"
                            : profile.weightTrend?.direction === "down"
                            ? "text-emerald-500"
                            : isDark
                            ? "text-slate-300"
                            : "text-slate-700"
                        }
                      >
                        {profile.weightTrend?.direction === "up"
                          ? "↑"
                          : profile.weightTrend?.direction === "down"
                          ? "↓"
                          : "•"}
                      </span>
                      {directionLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      Weight & BMI trend
                    </h3>
                    <p
                      className={`mt-1 text-xs sm:text-sm ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Track how your body responds to your training over time.
                    </p>
                  </div>
                </div>

                <div className="w-full h-56 sm:h-64 md:h-72">
                  {weightData.length === 0 ? (
                    <div
                      className={`h-full flex items-center justify-center text-xs sm:text-sm rounded-xl border-dashed border ${
                        isDark
                          ? "border-slate-700 text-slate-400"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      Weight log data will appear here once you start tracking.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weightData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDark ? "#1e293b" : "#e2e8f0"}
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#020617" : "#ffffff",
                            borderColor: isDark ? "#1e293b" : "#e2e8f0",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          name="Weight (kg)"
                          stroke="#38bdf8"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="BMI"
                          name="BMI"
                          stroke="#a855f7"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div
                className={`rounded-2xl border p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Daily calorie intake
                  </h3>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Avg: {profile.averageDailyCalories || 0} kcal
                  </span>
                </div>
                <p
                  className={`text-xs sm:text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Your recent calorie logs will appear here as you start
                  tracking meals.
                </p>
                <div
                  className={`mt-2 rounded-xl border border-dashed px-3 py-6 text-xs sm:text-sm text-center ${
                    isDark
                      ? "border-slate-700 text-slate-400"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  No calorie entries yet.
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h3 className="text-base sm:text-lg font-semibold">
                  Profile summary
                </h3>
                <ul
                  className={`mt-1 space-y-2 text-xs sm:text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <li>
                    Training time is set to <strong>{profile.gymTiming || "not set"}</strong>.
                  </li>
                  <li>
                    Current weight is <strong>{profile.weight} kg</strong> with a
                    BMI of <strong>{profile.BMI}</strong>.
                  </li>
                  <li>
                    Track your workouts and nutrition regularly to see richer
                    trends here.
                  </li>
                </ul>
              </div>
            </section>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold ${
                  isDark
                    ? "bg-sky-500 text-white hover:bg-sky-400"
                    : "bg-sky-600 text-white hover:bg-sky-500"
                }`}
              >
                Edit profile
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold border ${
                  isDark
                    ? "border-red-500/60 text-red-300 hover:bg-red-950/40"
                    : "border-red-500/60 text-red-600 hover:bg-red-50"
                }`}
              >
                Delete account
              </button>
            </div>

            {showEdit && (
              <EditProfileForm
                profile={profile}
                isDark={isDark}
                onClose={() => setShowEdit(false)}
                onSuccess={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
              />
            )}

            {showDelete && (
              <DeleteAccountModal
                isDark={isDark}
                onClose={() => setShowDelete(false)}
                onDeleted={() => {
                  setProfile(null);
                  setShowDelete(false);
                  sessionStorage.removeItem("authToken");
                  window.location.href = "/";
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;