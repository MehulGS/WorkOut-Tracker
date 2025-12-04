import React from "react";

const AddBodyPartGroupModal = ({
  isOpen,
  onClose,
  groupId,
  newBodyPartName,
  setNewBodyPartName,
  newBodyPartDay,
  setNewBodyPartDay,
  creatingBodyPart,
  createBodyPartError,
  onCreate,
  textPrimary,
  textSecondary,
  cardBg,
  cardBorder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg w-full max-w-md p-6`}>
        <h2 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
          Add body part
        </h2>
        <p className={`text-xs mb-4 ${textSecondary}`}>
          Select a day and enter a body part name for this group.
        </p>

        {createBodyPartError && (
          <p className="text-xs text-red-500 mb-2">{createBodyPartError}</p>
        )}

        <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
          Day
        </label>
        <select
          value={newBodyPartDay}
          onChange={(e) => setNewBodyPartDay(e.target.value)}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-3"
          disabled={creatingBodyPart}
        >
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>

        <label className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-300">
          Body part name
        </label>
        <input
          type="text"
          value={newBodyPartName}
          onChange={(e) => setNewBodyPartName(e.target.value)}
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="e.g. Triceps"
          disabled={creatingBodyPart}
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              if (creatingBodyPart) return;
              onClose();
            }}
            className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-70"
            disabled={creatingBodyPart}
            onClick={() => onCreate(groupId)}
          >
            {creatingBodyPart ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBodyPartGroupModal;
