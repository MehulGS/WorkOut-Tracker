import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetUserDetailsAPI, RemoveMemberFromGroupAPI, GetGroupsAPI } from "../../../services/ApiServices";

const MemberDetail = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { groupId, memberId } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GetUserDetailsAPI(memberId);
        setMember(data);
      } catch (err) {
        const message = err?.message || "Failed to load member";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(`/group-exercise/${groupId}`)}
        className="mb-4 text-xs text-emerald-500 hover:text-emerald-400"
      >
        ← Back to group
      </button>

      <h1 className={`text-2xl font-semibold mb-4 ${textPrimary}`}>
        Member Detail
      </h1>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading member...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && !member && (
        <p className={`text-sm ${textSecondary}`}>
          Member not found.
        </p>
      )}

      {!loading && !error && member && (
        <div className={`${cardBg} ${cardBorder} border rounded-lg p-6 shadow-sm space-y-4`}>
          {member.image && (
            <div className="flex justify-center mb-2">
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          )}

          <div>
            <p className={`text-lg font-semibold ${textPrimary}`}>{member.name}</p>
            <p className={`text-xs ${textSecondary}`}>{member.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <p className={textSecondary}>Gender: {member.gender || "-"}</p>
            <p className={textSecondary}>Age: {member.age ?? "-"}</p>
            <p className={textSecondary}>Height: {member.height ?? "-"} cm</p>
            <p className={textSecondary}>Weight: {member.weight ?? "-"} kg</p>
            <p className={textSecondary}>BMI: {member.BMI ?? "-"}</p>
            <p className={textSecondary}>Gym timing: {member.gymTiming || "-"}</p>
          </div>

          <div className="text-xs space-y-1">
            <p className={textSecondary}>
              Date of birth: {member.dateOfBirth
                ? new Date(member.dateOfBirth).toLocaleDateString()
                : "-"}
            </p>
            <p className={textSecondary}>
              Joined: {member.createdAt
                ? new Date(member.createdAt).toLocaleDateString()
                : "-"}
            </p>
          </div>

          {removeError && (
            <p className="text-xs text-red-500">{removeError}</p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              onClick={() => {
                setRemoveError(null);
                setIsRemoveModalOpen(true);
              }}
            >
              Remove member
            </button>
          </div>
        </div>
      )}

      {isRemoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg w-full max-w-md p-6`}>
            <h2 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
              Remove member
            </h2>
            <p className={`text-xs mb-4 ${textSecondary}`}>
              Are you sure you want to remove this member from the group?
            </p>

            {removeError && (
              <p className="text-xs text-red-500 mb-2">{removeError}</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={removing}
                onClick={() => {
                  if (removing) return;
                  setIsRemoveModalOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={removing}
                onClick={async () => {
                  if (!groupId || !memberId) {
                    setRemoveError("Missing group or member id");
                    return;
                  }

                  try {
                    setRemoving(true);
                    setRemoveError(null);
                    await RemoveMemberFromGroupAPI({ roomId: groupId, memberId });

                    // optional: refresh groups to keep state consistent
                    try {
                      await GetGroupsAPI();
                    } catch (e) {
                      // ignore, best-effort
                    }

                    setIsRemoveModalOpen(false);
                    navigate(`/group-exercise/${groupId}`);
                  } catch (err) {
                    const message = err?.message || err?.msg || "Failed to remove member";
                    setRemoveError(message);
                  } finally {
                    setRemoving(false);
                  }
                }}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70"
              >
                {removing ? "Removing..." : "Confirm remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetail;
