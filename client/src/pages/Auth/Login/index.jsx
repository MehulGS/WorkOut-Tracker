
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { LoginAPI } from "../../../services/ApiServices";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await LoginAPI({ email, password });
      const token = res?.token || res?.data?.token || "demo-token";
      login(token);
      navigate("/exercise", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label
            className={
              isDark
                ? "block text-xs font-medium text-slate-300"
                : "block text-xs font-medium text-slate-600"
            }
          >
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              isDark
                ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            }
          />
        </div>
        <div className="space-y-1">
          <label
            className={
              isDark
                ? "block text-xs font-medium text-slate-300"
                : "block text-xs font-medium text-slate-600"
            }
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                isDark
                  ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={
                isDark
                  ? "absolute inset-y-0 right-2 flex items-center px-1 text-[11px] text-slate-300 hover:text-cyan-300"
                  : "absolute inset-y-0 right-2 flex items-center px-1 text-[11px] text-slate-500 hover:text-slate-700"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 text-white text-sm font-semibold py-2.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

