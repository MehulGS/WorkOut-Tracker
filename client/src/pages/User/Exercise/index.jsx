
import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const Exercise = () => {
  const { isDark } = useTheme();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1
        className={`text-2xl font-semibold mb-2 ${
          isDark ? "text-slate-50" : "text-slate-900"
        }`}
      >
        Exercise Detail
      </h1>
      <p
        className={`text-sm mb-4 ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        This is a placeholder for your exercise detail screen. Wire it to your
        real exercise data, workouts and routines.
      </p>
    </div>
  );
};

export default Exercise;

