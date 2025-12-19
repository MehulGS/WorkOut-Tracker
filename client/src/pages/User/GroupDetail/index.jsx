import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetGroupsAPI, InviteMembersToGroupAPI, GetGroupBodyPartsWithExercisesAPI, CreateGroupBodyPartAPI } from "../../../services/ApiServices";
import { AddBodyPartGroupModal, InviteMemberModal } from "../../../component";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const getCurrentDay = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
};

const GroupDetail = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(() => location.state?.activeTab || "members");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [bodyParts, setBodyParts] = useState([]);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [bodyError, setBodyError] = useState(null);
  const [isAddBodyPartOpen, setIsAddBodyPartOpen] = useState(false);
  const [newBodyPartName, setNewBodyPartName] = useState("");
  const [newBodyPartDay, setNewBodyPartDay] = useState("Monday");
  const [creatingBodyPart, setCreatingBodyPart] = useState(false);
  const [createBodyPartError, setCreateBodyPartError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GetGroupsAPI();
        const list = Array.isArray(data) ? data : data?.groups || [];
        setGroups(list);

        if (groupId) {
          try {
            setBodyLoading(true);
            setBodyError(null);
            const bpData = await GetGroupBodyPartsWithExercisesAPI(groupId);
            const bpList = Array.isArray(bpData) ? bpData : bpData?.bodyParts || [];
            setBodyParts(bpList);
          } catch (bpErr) {
            const message = bpErr?.message || "Failed to load group body parts";
            setBodyError(message);
          } finally {
            setBodyLoading(false);
          }
        }
      } catch (err) {
        const message = err?.message || "Failed to load group";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleInviteMembers = async (roomId) => {
    const raw = inviteEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (!raw.length) {
      setInviteError("At least one email is required");
      return;
    }

    if (!roomId) {
      setInviteError("No group selected");
      return;
    }

    try {
      setInviting(true);
      setInviteError(null);
      await InviteMembersToGroupAPI(roomId, { emails: raw });

      try {
        setLoading(true);
        setError(null);
        const data = await GetGroupsAPI();
        const list = Array.isArray(data) ? data : data?.groups || [];
        setGroups(list);
      } finally {
        setLoading(false);
      }

      setIsInviteModalOpen(false);
      setInviteEmails("");
    } catch (err) {
      const message = err?.message || err?.msg || "Failed to invite members";
      setInviteError(message);
    } finally {
      setInviting(false);
    }
  };

  const handleCreateBodyPart = async (roomId) => {
    const trimmedName = newBodyPartName.trim();
    if (!trimmedName) {
      setCreateBodyPartError("Body part name is required");
      return;
    }

    if (!roomId) {
      setCreateBodyPartError("No group selected");
      return;
    }

    try {
      setCreatingBodyPart(true);
      setCreateBodyPartError(null);
      await CreateGroupBodyPartAPI(roomId, {
        days: newBodyPartDay,
        name: trimmedName,
      });

      try {
        setBodyLoading(true);
        setBodyError(null);
        const bpData = await GetGroupBodyPartsWithExercisesAPI(roomId);
        const bpList = Array.isArray(bpData) ? bpData : bpData?.bodyParts || [];
        setBodyParts(bpList);
      } finally {
        setBodyLoading(false);
      }

      setIsAddBodyPartOpen(false);
      setNewBodyPartName("");
    } catch (err) {
      const message = err?.message || err?.msg || "Failed to add body part";
      setCreateBodyPartError(message);
    } finally {
      setCreatingBodyPart(false);
    }
  };

  const group = useMemo(
    () => groups.find((g) => g._id === groupId),
    [groups, groupId]
  );

  const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

  const members = Array.isArray(group?.members) ? group.members : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className={`text-2xl font-semibold mb-4 ${textPrimary}`}>
        Group Detail
      </h1>

      {loading && (
        <p className={`text-sm ${textSecondary}`}>Loading group...</p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && !group && (
        <p className={`text-sm ${textSecondary}`}>
          Group not found.
        </p>
      )}

      {!loading && !error && group && (
        <>
          <div
            className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm mb-6 flex items-center justify-between`}
          >
            <div>
              <h2 className={`text-lg font-semibold mb-1 ${textPrimary}`}>
                {group.name || group.owner?.name || "Group"}
              </h2>
              <p className={`text-xs ${textSecondary}`}>
                Owner: {group.owner?.email}
              </p>
              <p className={`text-xs mt-1 ${textSecondary}`}>
                Total members: {group.totalMembers ?? members.length}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              onClick={() => {
                setInviteError(null);
                setInviteEmails("");
                setIsInviteModalOpen(true);
              }}
            >
              Add member
            </button>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 mb-4 flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`pb-2 border-b-2 -mb-px transition-colors ${activeTab === "members"
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              Members
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("exercise")}
              className={`pb-2 border-b-2 -mb-px transition-colors ${activeTab === "exercise"
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              Exercise Detail
            </button>
          </div>

          {activeTab === "members" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className={`${cardBg} ${cardBorder} border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-500 hover:shadow-md transition`}
                  onClick={() => navigate(`/group-exercise/${groupId}/member/${member._id}`)}
                >
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      {member.name}
                    </p>
                    <p className={`text-xs ${textSecondary}`}>
                      {member.email}
                    </p>
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <p className={`text-sm ${textSecondary}`}>
                  No members in this group.
                </p>
              )}
            </div>
          )}

          {activeTab === "exercise" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-sm font-medium ${textPrimary}`}>
                  Weekly Workout Plan
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  onClick={() => {
                    setCreateBodyPartError(null);
                    setNewBodyPartName("");
                    setNewBodyPartDay(getCurrentDay());
                    setIsAddBodyPartOpen(true);
                  }}
                >
                  Add body part
                </button>
              </div>

              {bodyLoading && (
                <p className={`text-sm ${textSecondary}`}>Loading workout plan...</p>
              )}

              {!bodyLoading && bodyError && (
                <p className="text-sm text-red-500">{bodyError}</p>
              )}

              {!bodyLoading && !bodyError && bodyParts.length === 0 && (
                <p className={`text-sm ${textSecondary}`}>
                  No workout plan found. Add body parts to get started.
                </p>
              )}

              {!bodyLoading && !bodyError && bodyParts.length > 0 && (
                <div className="space-y-8">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayBodyParts = bodyParts.filter(
                      (bp) => bp.days === day || (Array.isArray(bp.days) && bp.days.includes(day))
                    );
                    const isCurrentDay = day === getCurrentDay();

                    return (
                      <div key={day} className="space-y-3">
                        <h3
                          className={`text-base font-medium ${
                            isCurrentDay ? "text-emerald-500" : textPrimary
                          }`}
                        >
                          {day} {isCurrentDay && "(Today)"}
                        </h3>
                        
                        {dayBodyParts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dayBodyParts.map((bp) => {
                              const exercises = Array.isArray(bp.exercises) ? bp.exercises : [];
                              const totalExercises = exercises.length;
                              
                              return (
                                <button
                                  key={bp._id}
                                  type="button"
                                  onClick={() => navigate(`/group-exercise/${groupId}/body-part/${bp._id}`)}
                                  className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm flex flex-col justify-between text-left hover:border-emerald-500 hover:shadow-md transition ${
                                    isCurrentDay ? "ring-1 ring-emerald-500" : ""
                                  }`}
                                >
                                  <div>
                                    <p className={`text-sm font-semibold mb-1 ${textPrimary}`}>
                                      {bp.name}
                                    </p>
                                    <p className={`text-xs ${textSecondary}`}>
                                      {totalExercises} exercise
                                      {totalExercises === 1 ? "" : "s"}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className={`text-xs ${textSecondary} italic`}>
                            No exercises scheduled for {day}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupId={groupId}
        inviteEmails={inviteEmails}
        setInviteEmails={setInviteEmails}
        inviting={inviting}
        inviteError={inviteError}
        onInvite={handleInviteMembers}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        cardBg={cardBg}
        cardBorder={cardBorder}
      />

      <AddBodyPartGroupModal
        isOpen={isAddBodyPartOpen}
        onClose={() => setIsAddBodyPartOpen(false)}
        groupId={groupId}
        newBodyPartName={newBodyPartName}
        setNewBodyPartName={setNewBodyPartName}
        newBodyPartDay={newBodyPartDay}
        setNewBodyPartDay={setNewBodyPartDay}
        creatingBodyPart={creatingBodyPart}
        createBodyPartError={createBodyPartError}
        onCreate={handleCreateBodyPart}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        cardBg={cardBg}
        cardBorder={cardBorder}
      />
    </div>
  );
};

export default GroupDetail;
