import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { ResetPasswordAPI } from "../../../services/ApiServices";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const emailFromState = location?.state?.email || "";
  const otpFromState = location?.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromState || !otpFromState) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [emailFromState, otpFromState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await ResetPasswordAPI({
        email: emailFromState,
        otp: otpFromState,
        newPassword,
      });

      setMessage(res?.message || "Password reset successfully");

      // Clear sensitive data by navigating away (email/otp not persisted anywhere else)
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err?.error || err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            className={
              isDark
                ? "block text-xs font-medium text-slate-300"
                : "block text-xs font-medium text-slate-600"
            }
          >
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={
              isDark
                ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            }
            placeholder="Enter new password"
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
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={
              isDark
                ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            }
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {message && !error && (
          <p className="text-xs text-emerald-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-600 text-white text-sm font-semibold py-2.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;