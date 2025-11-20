import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../../component";
import ScrollToTop from "../../services/ScrollToTop";
import { useTheme } from "../../context/ThemeContext";

const SystemLayout = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-[#030712] text-slate-100"
          : "min-h-screen bg-[#F4F7FE] text-slate-900"
      }
    >
      <ScrollToTop />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SystemLayout;