import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { publicNavbar, appNavbar } from "../../constant/data";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = isAuthenticated ? appNavbar : publicNavbar;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed -top-1 left-0 w-full z-50 transition-all duration-300 !p-0 backdrop-blur-md border-b ${
        scrolled
          ? isDark
            ? "bg-slate-950/80 border-slate-800 shadow-[0_10px_40px_rgba(15,23,42,0.9)]"
            : "bg-white/80 border-slate-200 shadow-md"
          : isDark
          ? "bg-transparent border-transparent"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* Subtle background glow in dark mode */}
      {isDark && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-60">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-0 top-4 h-32 w-32 rounded-full bg-fuchsia-500/25 blur-3xl" />
        </div>
      )}

      <div className="relative container m-auto sm:px-2 md:px-0 lg:px-5">
        <div className="flex items-center justify-between py-3 md:py-4 lg:py-5">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="relative">
                {isDark && (
                  <span className="absolute inset-0 rounded-2xl bg-cyan-500/30 blur-md"></span>
                )}
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500">
                  <div
                    className={`rounded-2xl px-2 py-1 ${
                      isDark ? "bg-slate-950" : "bg-white"
                    }`}
                  >
                    <img
                      src="/assets/Logo/NBLOGO.webp"
                      alt="Logo"
                      className="h-8 sm:h-9 md:h-11 lg:h-12 w-auto"
                      fetchPriority="high"
                      decoding="async"
                      loading="eager"
                      width="64"
                      height="64"
                      style={{ contentVisibility: "visible" }}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span
                  className={`text-xs tracking-[0.25em] uppercase ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Gym Tracker
                </span>
                <span
                  className={`text-sm md:text-base font-semibold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  Sculpt. Track. Repeat.
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop/Tablet Navigation (md and up) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm lg:text-[15px] font-medium tracking-wide transition-all duration-200 ${
                    active
                      ? isDark
                        ? "text-cyan-300"
                        : "text-sky-600"
                      : isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] rounded-full origin-left scale-x-0 transition-transform duration-200 ${
                      active
                        ? "scale-x-100"
                        : "group-hover:scale-x-100"
                    } ${
                      isDark
                        ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_15px_rgba(6,182,212,0.9)]"
                        : "bg-gradient-to-r from-sky-500 to-indigo-500"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-300 backdrop-blur-sm ${
                isDark
                  ? "border-cyan-500/50 bg-slate-950/70 text-cyan-100 hover:border-fuchsia-400 hover:text-fuchsia-200 shadow-[0_0_18px_rgba(8,47,73,1)]"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white shadow-sm"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full shadow-[0_0_12px_currentColor] ${
                  isDark ? "bg-cyan-400" : "bg-amber-400"
                }`}
              />
              <span>{isDark ? "Neon" : "Day"}</span>
            </button>

            {/* Desktop: auth actions */}
            <div className="hidden md:flex items-center gap-2">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition-colors"
                >
                  Login
                </button>
              )}

              {isAuthenticated && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className={`flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-medium transition-colors ${
                      isDark
                        ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                        : "border-slate-200 bg-white/80 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-[11px] font-semibold text-slate-950">
                      GT
                    </span>
                    <span className="hidden lg:inline">Profile</span>
                  </button>
                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-40 rounded-xl border shadow-lg text-xs overflow-hidden z-50 ${
                        isDark
                          ? "bg-slate-900 border-slate-700 text-slate-100"
                          : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-slate-800/70 md:hover:bg-slate-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          // placeholder for profile route if you add it later
                        }}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-red-500 hover:bg-red-50 md:hover:bg-red-50"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          navigate("/", { replace: true });
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: Hamburger (below md) */}
            <div className="flex md:hidden items-center">
              <button
                className={`p-2 rounded-full border transition-colors duration-200 ${
                  isDark
                    ? "border-slate-700 text-slate-100 bg-slate-900/80"
                    : "border-slate-200 text-slate-700 bg-white/80"
                }`}
                onClick={() => {
                  setIsMenuOpen(true);
                  setUserMenuOpen(false);
                }}
              >
                <span className="sr-only">Open menu</span>
                <span className="block h-0.5 w-5 bg-current mb-1 rounded-full"></span>
                <span className="block h-0.5 w-5 bg-current mb-1 rounded-full"></span>
                <span className="block h-0.5 w-5 bg-current rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-60 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`relative w-64 max-w-full h-full shadow-xl p-6 flex flex-col animate-slideInLeft border-r backdrop-blur-xl ${
              isDark
                ? "bg-slate-950/95 border-slate-800"
                : "bg-white/95 border-slate-200"
            }`}
          >
            <button
              className={`absolute top-4 right-4 rounded-full p-1.5 border transition-colors ${
                isDark
                  ? "border-slate-700 text-slate-100 hover:bg-slate-800"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <span className="block h-0.5 w-4 bg-current mb-1 rotate-45 translate-y-0.5 rounded-full"></span>
              <span className="block h-0.5 w-4 bg-current -rotate-45 -translate-y-0.5 rounded-full"></span>
            </button>
            <div className="mb-4 mt-2 flex items-center gap-2 justify-between">
              <img
                src="/assets/Logo/NBLOGO.webp"
                alt="Logo"
                className="h-8 w-auto"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {isAuthenticated && (
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-[11px] font-semibold text-slate-950`}
                >
                  GT
                </span>
              )}
            </div>
            <nav className="flex flex-col space-y-4 mt-6">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? isDark
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                          : "bg-sky-50 text-sky-700 border border-sky-300"
                        : isDark
                        ? "text-slate-200 hover:bg-slate-800/80"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile auth actions */}
            <div className="mt-8 space-y-2">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className={`w-full rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                    isDark
                      ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }`}
                >
                  Login
                </button>
              )}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="w-full rounded-full px-4 py-2 text-xs font-semibold tracking-wide bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;