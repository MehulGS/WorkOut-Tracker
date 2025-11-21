import React, { useState } from "react";
import { EditProfileAPI } from "../../services/ApiServices";

const EditProfileForm = ({ profile, onClose, onSuccess, isDark }) => {
  const [name, setName] = useState(profile?.name || "");
  const [height, setHeight] = useState(profile?.height || "");
  const [gender, setGender] = useState((profile?.gender || "").toLowerCase());
  const [gymTiming, setGymTiming] = useState(profile?.gymTiming || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (name && name !== profile?.name) formData.append("name", name);
      if (height && height !== profile?.height) formData.append("height", height);
      if (gender && gender !== profile?.gender) formData.append("gender", gender);
      if (gymTiming && gymTiming !== profile?.gymTiming) formData.append("gymTiming", gymTiming);
      if (image) formData.append("image", image);

      const data = await EditProfileAPI(formData);

      if (onSuccess && data?.user) {
        onSuccess(data.user);
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(typeof err === "string" ? err : err?.error || err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 sm:px-6 ${
        isDark ? "bg-black/60" : "bg-slate-900/40"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-4 sm:p-6 ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-50" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full px-2 py-1 text-xs sm:text-sm ${
              isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
            }`}
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center text-sm sm:text-base font-semibold text-white">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              profile?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex flex-col text-xs sm:text-sm">
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>Current gender</span>
            <span className="font-medium capitalize">
              {gender || profile?.gender || "Not set"}
            </span>
          </div>
        </div>

        {error && (
          <div
            className={`mb-3 text-xs sm:text-sm rounded-xl px-3 py-2 ${
              isDark
                ? "bg-red-950/50 border border-red-500/40 text-red-200"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-sm sm:text-base">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-50 placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              }`}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-50 placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              }`}
              placeholder="Enter your height"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Gender</label>
            <select
              value={gender || (profile?.gender || "").toLowerCase()}
              onChange={(e) => setGender(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-50"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Gym timing</label>
            <input
              type="text"
              value={gymTiming}
              onChange={(e) => setGymTiming(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-50 placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
              }`}
              placeholder="e.g. 6:00 AM - 7:00 AM"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-medium">Profile image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-xs sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                isDark
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center justify-center ${
                isDark
                  ? "bg-sky-500 text-white hover:bg-sky-400 disabled:bg-sky-700/60"
                  : "bg-sky-600 text-white hover:bg-sky-500 disabled:bg-sky-400/70"
              }`}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
