import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { GetGroupBodyPartsWithExercisesAPI } from "../../../services/ApiServices";

const GroupBodyPartDetail = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { groupId, bodyPartId } = useParams();

    const [bodyPart, setBodyPart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBodyPart = useCallback(async () => {
        if (!groupId || !bodyPartId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await GetGroupBodyPartsWithExercisesAPI(groupId);
            const list = Array.isArray(data) ? data : data?.bodyParts || [];
            const found = list.find((bp) => String(bp._id) === String(bodyPartId));
            setBodyPart(found || null);
        } catch (err) {
            const message = err?.message || "Failed to load body part";
            setError(message);
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

    const exercises = Array.isArray(bodyPart?.exercises) ? bodyPart.exercises : [];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <button
                    type="button"
                    onClick={() => navigate(`/group-exercise/${groupId}`)}
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
                                {exercises.map((ex) => (
                                    <button
                                        key={ex._id}
                                        type="button"
                                        onClick={() => navigate(`/group-exercise/${groupId}/exercise/${ex._id}`)}
                                        className="w-full flex items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-left hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className={textPrimary}>{ex.name}</span>
                                        <span className="text-[10px] text-emerald-600">Open</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GroupBodyPartDetail;
