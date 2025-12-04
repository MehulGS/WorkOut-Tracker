import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { AddGroupExerciseModal } from "../../../component";
import { GetGroupBodyPartsWithExercisesAPI, GetGroupBodyPartExercisesAPI, GroupLogExerciseSetAPI } from "../../../services/ApiServices";

const GroupBodyPartDetail = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { groupId, bodyPartId } = useParams();

    const [bodyPart, setBodyPart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [activeExerciseId, setActiveExerciseId] = useState(null);
    const [exerciseSets, setExerciseSets] = useState({}); // exerciseId -> array of sets
    const [setInputs, setSetInputs] = useState({}); // exerciseId -> { weightKg, reps }
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const fetchBodyPart = useCallback(async () => {
        if (!groupId || !bodyPartId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await GetGroupBodyPartsWithExercisesAPI(groupId);
            const list = Array.isArray(data) ? data : data?.bodyParts || [];
            const found = list.find((bp) => String(bp._id) === String(bodyPartId));
            setBodyPart(found || null);

            if (found) {
                try {
                    const exData = await GetGroupBodyPartExercisesAPI(groupId, bodyPartId);
                    const exList = Array.isArray(exData) ? exData : exData?.exercises || [];
                    setExercises(exList);
                } catch (exErr) {
                    console.error("Failed to load exercises for body part", exErr);
                    setExercises([]);
                }
            } else {
                setExercises([]);
            }
        } catch (err) {
            const message = err?.message || "Failed to load body part";
            setError(message);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    }, [groupId, bodyPartId]);

    useEffect(() => {
        fetchBodyPart();
    }, [fetchBodyPart]);

    const textPrimary = isDark ? "text-slate-50" : "text-slate-900";
    const textSecondary = isDark ? "text-slate-300" : "text-slate-600";
    const cardBg = isDark ? "bg-slate-800" : "bg-white";
    const cardBorder = isDark ? "border-slate-700" : "border-slate-200";

    const handleExerciseAdded = () => {
        // Refresh exercises (and body part) after adding a new one
        fetchBodyPart();
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleExerciseClick = (exerciseId) => {
        setActiveExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
    };

    const handleInputChange = (exerciseId, field, value) => {
        setSetInputs((prev) => ({
            ...prev,
            [exerciseId]: {
                weightKg: prev[exerciseId]?.weightKg ?? "",
                reps: prev[exerciseId]?.reps ?? "",
                [field]: value,
            },
        }));
    };

    const handleAddSet = async (exerciseId) => {
        const currentSets = Array.isArray(exerciseSets[exerciseId])
            ? exerciseSets[exerciseId]
            : [];

        if (currentSets.length >= 3 || saving) return;

        const input = setInputs[exerciseId] || {};
        const weightKg = Number(input.weightKg);
        const reps = Number(input.reps);

        if (!weightKg || !reps) return;

        try {
            setSaving(true);
            const setLog = await GroupLogExerciseSetAPI({
                roomId: groupId,
                exerciseId,
                weightKg,
                reps,
            });

            setExerciseSets((prev) => ({
                ...prev,
                [exerciseId]: [...currentSets, setLog],
            }));

            setSetInputs((prev) => ({
                ...prev,
                [exerciseId]: { weightKg: "", reps: "" },
            }));

            const newCount = currentSets.length + 1;
            if (newCount >= 3) {
                const idx = exercises.findIndex((ex) => ex._id === exerciseId);
                const next = idx >= 0 && idx + 1 < exercises.length ? exercises[idx + 1] : null;
                setActiveExerciseId(next ? next._id : null);
            }
        } catch (err) {
            const msg =
                (typeof err === "string" && err) ||
                err?.message ||
                err?.error ||
                "Failed to log group set";

            if (err?.message === "Maximum 3 sets per exercise per day reached") {
                showToast(msg);
                setActiveExerciseId(null);
            } else {
                console.error("Failed to log group set", err);
                showToast(msg);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {toastMessage && (
                <div className="fixed top-4 right-4 z-40 rounded-md bg-slate-900 text-slate-50 px-3 py-2 text-xs shadow-lg border border-slate-700">
                    {toastMessage}
                </div>
            )}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={() =>
                        navigate(`/group-exercise/${groupId}`, {
                            state: { activeTab: "exercise" },
                        })
                    }
                    className="text-xs text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                >
                    ← Back to group
                </button>

                <div className="ml-auto text-right">
                    <h1 className={`text-2xl font-semibold ${textPrimary}`}>
                        Day: {bodyPart?.days || "-"}
                    </h1>
                    <p className={`text-sm ${textSecondary}`}>
                        {bodyPart?.name || "Body part"}
                    </p>
                </div>
            </div>

            {loading && (
                <p className={`text-sm ${textSecondary}`}>Loading body part...</p>
            )}

            {!loading && error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {!loading && !error && !bodyPart && (
                <p className={`text-sm ${textSecondary}`}>
                    Body part not found.
                </p>
            )}

            {!loading && !error && bodyPart && (
                <>
                    <div className={`${cardBg} ${cardBorder} border rounded-lg p-4 shadow-sm mb-4`}>
                        <h2 className={`text-sm font-semibold mb-2 ${textPrimary}`}>
                            Exercises
                        </h2>

                        {exercises.length === 0 && (
                            <p className={`text-xs ${textSecondary}`}>
                                No exercises added for this body part yet.
                            </p>
                        )}

                        {exercises.length > 0 && (
                            <div className="space-y-2">
                                {exercises.map((ex) => {
                                    const sets = Array.isArray(exerciseSets[ex._id])
                                        ? exerciseSets[ex._id]
                                        : [];
                                    const input = setInputs[ex._id] || { weightKg: "", reps: "" };
                                    const isActive = activeExerciseId === ex._id;
                                    const totalVolume = sets.reduce(
                                        (sum, s) => sum + (s.weightKg || 0) * (s.reps || 0),
                                        0
                                    );

                                    return (
                                        <div
                                            key={ex._id}
                                            className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs bg-slate-900/5 dark:bg-slate-900/40"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleExerciseClick(ex._id)}
                                                className="w-full flex items-center justify-between text-left"
                                            >
                                                <span className={textPrimary}>{ex.name}</span>
                                                <span className="text-[10px] text-emerald-600">
                                                    {isActive ? "Hide" : "Log sets"}
                                                </span>
                                            </button>

                                            {isActive && (
                                                <div className="mt-2 space-y-2">
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className={textSecondary}>
                                                            Sets: {sets.length}/3
                                                        </span>
                                                        <span className={textSecondary}>
                                                            Volume: {totalVolume} kg
                                                        </span>
                                                    </div>

                                                    {/* Highlight current / upcoming set row */}
                                                    <div className="rounded-md bg-emerald-50/80 dark:bg-emerald-900/40 px-3 py-1 text-[11px] flex items-center justify-between">
                                                        <span className={isDark ? "text-slate-50" : textSecondary}>
                                                            Set {Math.min(sets.length + 1, 3)}
                                                        </span>
                                                        {sets.length > 0 && (
                                                            <span className={isDark ? "text-slate-50" : textSecondary}>
                                                                Last: {sets[sets.length - 1].weightKg} kg x {sets[sets.length - 1].reps}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Completed sets list */}
                                                    {sets.length > 0 && (
                                                        <div className="space-y-1">
                                                            {sets.map((s, idx) => (
                                                                <div
                                                                    key={s._id || idx}
                                                                    className="flex items-center justify-between rounded bg-emerald-50 dark:bg-slate-800 px-2 py-1"
                                                                >
                                                                    <span className={textSecondary}>
                                                                        Set {idx + 1}
                                                                    </span>
                                                                    <span className={textPrimary}>
                                                                        {s.weightKg} kg x {s.reps}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {sets.length < 3 && (
                                                        <form
                                                            className="mt-2 space-y-2"
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                handleAddSet(ex._id);
                                                            }}
                                                        >
                                                            <div className="flex gap-2">
                                                                <div className="flex-1">
                                                                    <label className={`block text-[10px] mb-1 ${textSecondary}`}>
                                                                        Kg
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.5"
                                                                        min="0"
                                                                        value={input.weightKg}
                                                                        onChange={(e) =>
                                                                            handleInputChange(
                                                                                ex._id,
                                                                                "weightKg",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className={`block text-[10px] mb-1 ${textSecondary}`}>
                                                                        Reps
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={input.reps}
                                                                        onChange={(e) =>
                                                                            handleInputChange(
                                                                                ex._id,
                                                                                "reps",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-800 dark:border-slate-700"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() =>
                                                                        setSetInputs((prev) => ({
                                                                            ...prev,
                                                                            [ex._id]: {
                                                                                weightKg: "",
                                                                                reps: "",
                                                                            },
                                                                        }))
                                                                    }
                                                                    className="text-[10px] text-slate-500 hover:text-slate-700"
                                                                >
                                                                    Clear
                                                                </button>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="text-[10px] text-emerald-600 hover:text-emerald-500 underline underline-offset-2"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/group-exercise/${groupId}/exercise/${ex._id}`,
                                                                                { state: { bodyPartId } }
                                                                            )
                                                                        }
                                                                    >
                                                                        Overview
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        disabled={saving}
                                                                        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
                                                                    >
                                                                        {saving ? "Saving..." : "Add set"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddExerciseModal(true)}
                                className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                            >
                                Add exercise
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showAddExerciseModal && (
                <AddGroupExerciseModal
                    isDark={isDark}
                    roomId={groupId}
                    bodyPartId={bodyPartId}
                    onClose={() => setShowAddExerciseModal(false)}
                    onAdded={handleExerciseAdded}
                />
            )}
        </div>
    );
};

export default GroupBodyPartDetail;
