import React from "react";

const ParticipantHistoryModal = ({ isDark, participant, logs, onClose }) => {
  if (!participant) return null;

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const cardBorder = isDark ? "border-slate-800" : "border-slate-200";

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6 ${
        isDark ? "bg-black/60" : "bg-slate-900/40"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-4 sm:p-6 ${cardBg} ${cardBorder}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {participant.user?.image && (
              <img
                src={participant.user.image}
                alt={participant.user?.name || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className={`text-base sm:text-lg font-semibold ${textPrimary}`}>
                {participant.user?.name || "Participant"}
              </h2>
              <p className={`text-[11px] ${textSecondary}`}>
                {participant.totalSets} sets · {participant.totalWeight} kg total
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              isDark
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Close
          </button>
        </div>

        <div className="mt-2">
          <p className={`text-xs mb-2 ${textSecondary}`}>Set history</p>
          {(!Array.isArray(logs) || logs.length === 0) && (
            <p className={`text-xs ${textSecondary}`}>
              No sets logged yet for this participant.
            </p>
          )}

          {Array.isArray(logs) && logs.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <div>
                    <p className={textPrimary}>{log.weightKg} kg · {log.reps} reps</p>
                    <p className={`text-[10px] ${textSecondary}`}>
                      Set #{log.setNumber}
                    </p>
                  </div>
                  <p className={`text-[10px] ${textSecondary}`}>
                    {new Date(log.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantHistoryModal;
