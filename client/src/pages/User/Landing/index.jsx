
import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      <section className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />

        <div className="relative max-w-4xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-3">
              Gym Tracker
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              <span className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                Glow up your routine.
              </span>
              <span className="block text-slate-100/90 mt-1">
                Track workouts, nutrition and weight in one place.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-6">
              Start with a simple overview of your progress and switch into neon
              focus mode when it&apos;s time to train. Accessible from any device,
              optimized for consistency.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.7)] hover:bg-sky-400 transition-colors"
              >
                Get started — Login
              </Link>
              <span className="text-xs text-slate-400">
                No account yet? You can still explore the interface before logging in.
              </span>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-fuchsia-500/20 blur-2xl" />
            <div className="relative rounded-3xl border border-cyan-500/30 bg-slate-950/70 p-5 shadow-[0_0_35px_rgba(8,47,73,0.9)]">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-1">
                    Today
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    Push workout &amp; macro overview
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded-xl bg-slate-900/80 border border-slate-700/70 px-3 py-2">
                    <p className="text-slate-400 mb-1">Workout</p>
                    <p className="text-cyan-400 font-semibold">45 min</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-700/70 px-3 py-2">
                    <p className="text-slate-400 mb-1">Calories</p>
                    <p className="text-amber-400 font-semibold">520 kcal</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-700/70 px-3 py-2">
                    <p className="text-slate-400 mb-1">Weight</p>
                    <p className="text-fuchsia-400 font-semibold">72.3 kg</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Switch to the app view after login to unlock full exercise,
                  nutrition and weight log dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-950/80 border-t border-slate-800 px-4 py-10">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3 text-xs sm:text-sm text-slate-300">
          <div>
            <h2 className="text-slate-100 font-semibold mb-2 text-sm">About</h2>
            <p>
              Gym Tracker helps you stay consistent with structured logging for
              workouts, meals and bodyweight. Dark neon and soft light themes
              keep it comfortable any time of day.
            </p>
          </div>
          <div>
            <h2 className="text-slate-100 font-semibold mb-2 text-sm">Features</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Exercise detail tracking</li>
              <li>Nutrition overview &amp; macros</li>
              <li>Weight log timeline</li>
            </ul>
          </div>
          <div id="contact">
            <h2 className="text-slate-100 font-semibold mb-2 text-sm">Contact</h2>
            <p>
              Have feedback or ideas? Hook this section up to your real contact
              form or email when you&apos;re ready.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

