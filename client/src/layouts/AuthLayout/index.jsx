import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SIDEBARLOGO } from "../../assets";

const AuthLayout = () => {
  const [theme, setTheme] = useState("light");

  const isDark = theme === "dark";

  return (
    <div
      className={`flex min-h-dvh relative transition-colors duration-300 overflow-hidden ${
        isDark
          ? "bg-[#030712] text-slate-100"
          : "bg-[#F4F7FE] text-slate-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm transition-all duration-300 ${
          isDark
            ? "border-cyan-400/60 bg-black/40 text-cyan-100 hover:border-pink-500 hover:text-pink-200 shadow-[0_0_20px_rgba(45,212,191,0.6)]"
            : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full shadow-[0_0_10px_currentColor] ${
            isDark ? "bg-cyan-400" : "bg-amber-400"
          }`}
        />
        <span>{isDark ? "Neon Night" : "Soft Light"}</span>
      </button>

      {/* Background glow elements for dark mode */}
      {isDark && (
        <>
          <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </>
      )}

      {/* Left Side - Hidden on small screens */}
      <div
        className={`w-1/2 hidden md:flex items-center justify-center rounded-br-[200px] overflow-hidden border-r-[8px] border-transparent bg-clip-border transition-all duration-500 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top,_#22d3ee_0,_#0f172a_45%,_#020617_100%)] shadow-[0_0_40px_rgba(34,211,238,0.6)]"
            : "bg-gradient-to-b from-green-400 via-blue-500 to-purple-600 shadow-lg"
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-center rounded-br-[196px] transition-colors duration-500 ${
            isDark
              ? "bg-[#020617]/80 border border-cyan-400/30 shadow-[0_0_35px_rgba(56,189,248,0.8)]"
              : "bg-black"
          }`}
        >
          <img
            src={SIDEBARLOGO}
            alt="Logo"
            className="max-w-[55%] max-h-[55%] drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
          />
        </div>
      </div>

      {/* Right Side - Full width on small screens */}
      <div
        className={`w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center transition-colors duration-500 ${
          isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-[#F4F7FE]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border shadow-xl backdrop-blur-sm transition-all duration-500 ${
            isDark
              ? "border-slate-700/80 bg-slate-900/70 shadow-[0_0_40px_rgba(15,118,110,0.5)]"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="px-6 pt-6 pb-2 flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {isDark ? "Gym Tracker" : "Welcome"}
            </p>
            <h1
              className={`text-2xl font-semibold tracking-tight ${
                isDark
                  ? "bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent"
                  : "text-slate-900"
              }`}
            >
              {isDark ? "Glow up your workout." : "Track your fitness journey."}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm">
              {isDark
                ? "Switch between neon night and soft light while you log workouts, monitor progress, and stay consistent."
                : "Sign in to manage workouts, monitor your progress, and stay on top of your fitness goals."}
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;