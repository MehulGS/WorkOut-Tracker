
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetGroupsAPI, CreateGroupAPI, DeleteGroupAPI } from "../../../services/ApiServices";

const GroupExercise = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GetGroupsAPI();
      setGroups(Array.isArray(data) ? data : data?.groups || []);
    } catch (err) {
      const message = err?.message || "Failed to load groups";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1
            className={`text-2xl font-semibold ${textPrimary}`}
          >
            Groups
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Browse your workout groups and see how many members are in each.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateError(null);
            setGroupName("");
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Add Group
        </button>
      </div>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading groups...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && groups.length === 0 && (
        <p className={`text-sm ${textSecondary}`}>
          No groups found.
        </p>
      )}

      {!loading && !error && groups.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {groups.map((group) => {
              const members = Array.isArray(group.members) ? group.members : [];
              return (
                <div
                  key={group._id}
                  className="block w-full text-left group"
                >
                  <div
                    className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm flex flex-col justify-between group-hover:border-emerald-500 group-hover:shadow-md transition`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/group-exercise/${group._id}`)}
                          className={`text-lg font-semibold ${textPrimary} hover:underline text-left`}
                        >
                          {group.name || "Group"}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === group._id}
                          onClick={async () => {
                            const ok = window.confirm("Are you sure you want to delete this group? This cannot be undone.");
                            if (!ok) return;
                            try {
                              setDeletingId(group._id);
                              await DeleteGroupAPI(group._id);
                              await fetchGroups();
                            } catch (err) {
                              // surface basic error via alert; you can replace with toast later
                              alert(err?.message || err?.error || "Failed to delete group");
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                          className="text-[11px] text-red-500 hover:text-red-400 disabled:opacity-60"
                        >
                          {deletingId === group._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                      <p className={`text-xs ${textSecondary}`}>
                        {members.length} member{members.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-xs ${textSecondary}`}>
                        Owner: {group.owner?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/group-exercise/${group._id}`)}
                        className="text-xs text-emerald-500 group-hover:text-emerald-400 underline underline-offset-2"
                      >
                        View group →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg w-full max-w-md p-6`}>
            <h2 className={`text-lg font-semibold mb-2 ${textPrimary}`}>Create Group</h2>
            <p className={`text-xs mb-4 ${textSecondary}`}>
              Enter a name for your new workout group.
            </p>

            {createError && (
              <p className="text-xs text-red-500 mb-2">{createError}</p>
            )}

            <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
              Group name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Morning Gym Buddies"
              disabled={creating}
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (creating) return;
                  setIsAddModalOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const trimmed = groupName.trim();
                  if (!trimmed) {
                    setCreateError("Group name is required");
                    return;
                  }
                  try {
                    setCreating(true);
                    setCreateError(null);
                    await CreateGroupAPI({ name: trimmed });
                    setIsAddModalOpen(false);
                    setGroupName("");
                    await fetchGroups();
                  } catch (err) {
                    const message = err?.message || err?.msg || "Failed to create group";
                    setCreateError(message);
                  } finally {
                    setCreating(false);
                  }
                }}
                className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-70"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupExercise;

