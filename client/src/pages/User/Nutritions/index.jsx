
import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const Nutrition = () => {
  const { isDark } = useTheme();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1
        className={`text-2xl font-semibold mb-2 ${
          isDark ? "text-slate-50" : "text-slate-900"
        }`}
      >
        Nutrition Tracker
      </h1>
      <p
        className={`text-sm mb-4 ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        This is a placeholder for your nutrition tracker. Add meals, macros and
        daily goals here.
      </p>
    </div>
  );
};

export default Nutrition;

