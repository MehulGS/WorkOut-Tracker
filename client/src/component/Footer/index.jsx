
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full border-t backdrop-blur-sm text-xs md:text-sm ${
        isDark
          ? "border-slate-800 bg-slate-950/80 text-slate-300"
          : "border-slate-200 bg-white/80 text-slate-600"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="tracking-wide">© {new Date().getFullYear()} Gym Tracker</span>
        <span
          className={`text-[11px] ${
            isDark ? "text-slate-400" : "text-slate-400"
          }`}
        >
          Track your workouts, nutrition, and progress.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

