import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../../component";
import { useTheme } from "../../context/ThemeContext";
import { ScrollToTop } from "../../services";

const SystemLayout = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={
        isDark
          ? "min-h-screen flex flex-col bg-[#030712] text-slate-100"
          : "min-h-screen flex flex-col bg-[#F4F7FE] text-slate-900"
      }
    >
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SystemLayout;