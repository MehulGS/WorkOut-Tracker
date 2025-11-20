import React from "react";
import { Typography, Button, ButtonGroup } from "@mui/material";

const NotFoundPage = () => {
  const goHome = () => (window.location.href = "/");
  const goBack = () => window.history.back();

  return (
    <div className="relative w-full h-screen text-white overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-950">
      <style>{`
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes spinSlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 24px rgba(139,92,246,0.35); } 50% { box-shadow: 0 0 42px rgba(99,102,241,0.55); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-float { animation: floatY 6s ease-in-out infinite; }
        .animate-float-delayed { animation: floatY 7.5s ease-in-out 0.8s infinite; }
        .animate-rotate-slow { animation: spinSlow 30s linear infinite; }
        .grid-overlay { background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 40px 40px, 40px 40px; }
        .gradient-text { background: linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradientShift 8s ease infinite; }
        .glass-card { backdrop-filter: blur(10px); background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); }
        .neon-border { position: relative; }
        .neon-border:before { content: ""; position: absolute; inset: -1px; border-radius: 18px; padding: 1px; background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.4), rgba(20,184,166,0.35)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
      `}</style>

      {/* Subtle moving shapes / orbs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-purple-600/20 blur-3xl animate-float" />
      <div className="absolute -bottom-28 -right-28 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-3xl animate-float-delayed" />
      <div className="absolute inset-0 opacity-[0.18] grid-overlay" />

      {/* Rotating ring accent */}
      <div className="absolute w-[680px] h-[680px] rounded-full border border-cyan-400/10 animate-rotate-slow" />

      {/* Center card */}
      <div className="z-10 w-[92%] max-w-2xl glass-card rounded-2xl p-8 md:p-10 shadow-2xl neon-border animate-[pulseGlow_6s_ease-in-out_infinite]">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 opacity-40" />
            <Typography variant="h1" className="!text-7xl md:!text-8xl !font-extrabold gradient-text relative">
              404
            </Typography>
          </div>
          <Typography variant="h5" className="!mb-2 !font-semibold !tracking-wide">
            Page not found
          </Typography>
          <Typography variant="body1" className="!mb-8 !text-gray-300">
            The page you’re looking for might have been moved, renamed, or never existed.
          </Typography>

          <div className="flex items-center gap-3 mb-8 w-full">
            <div className="flex-1 hidden md:block h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-xs uppercase tracking-widest text-white/60">Navigate</span>
            <div className="flex-1 hidden md:block h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <ButtonGroup variant="contained" className="!gap-3 !bg-transparent">
            <Button color="primary" onClick={goHome} className="!px-5 !py-2 !normal-case !rounded-lg">
              Go Home
            </Button>
            <Button color="secondary" onClick={goBack} className="!px-5 !py-2 !normal-case !rounded-lg !bg-white/10 hover:!bg-white/20">
              Go Back
            </Button>
            <Button
              onClick={() => (window.location.href = "mailto:info@aumindustriesmfg.com?subject=Missing%20page")}
              className="!px-5 !py-2 !normal-case !rounded-lg !bg-teal-500/80 hover:!bg-teal-500"
            >
              Contact Support
            </Button>
          </ButtonGroup>

          {/* Helpful tip */}
          <div className="mt-8 text-xs text-white/60">
            Tip: Check the URL for typos or return to the dashboard.
          </div>
        </div>
      </div>

      {/* Decorative stars */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-[2px] h-[2px] bg-white/70 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.6,
            transform: `scale(${0.75 + Math.random() * 0.9})`,
            filter: "blur(0.2px)",
          }}
        />
      ))}
    </div>
  );
};

export default NotFoundPage;