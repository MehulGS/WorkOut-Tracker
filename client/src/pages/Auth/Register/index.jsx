import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { RegisterAPI } from "../../../services/ApiServices";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isDark } = useTheme();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "male",
        dateOfBirth: "",
        age: "",
        height: "",
        weight: "",
        BMI: 0,
        gymTiming: "09:00 AM",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const calculateBMI = (height, weight) => {
        if (height && weight) {
            const heightInMeters = height / 100; // convert cm to m
            return (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
        return 0;
    };

    const calculateAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 0 ? age : '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: name === "height" || name === "weight"
                ? (value === "" ? "" : parseFloat(value))
                : value,
        };

        // Recalculate BMI if height or weight changes
        if (name === "height" || name === "weight") {
            const height = name === "height"
                ? (value === "" ? 0 : parseFloat(value))
                : parseFloat(formData.height) || 0;
            const weight = name === "weight"
                ? (value === "" ? 0 : parseFloat(value))
                : parseFloat(formData.weight) || 0;

            if (height > 0 && weight > 0) {
                newFormData.BMI = parseFloat(calculateBMI(height, weight));
            } else {
                newFormData.BMI = 0;
            }
        }

        // Calculate age if date of birth changes
        if (name === "dateOfBirth") {
            const age = calculateAge(value);
            newFormData.age = age;
        }

        setFormData(newFormData);
    };

    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        setFormData(prev => ({
            ...prev,
            gymTiming: timeValue
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Frontend validation for required fields (must match backend expectations)
        const requiredFields = [
            "name",
            "email",
            "password",
            "gender",
            "dateOfBirth",
            "age",
            "height",
            "weight",
            "gymTiming",
        ];

        const missingFields = requiredFields.filter((field) => {
            const value = formData[field];
            return value === "" || value === null || value === undefined;
        });

        if (missingFields.length > 0) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    formDataToSend.append(key, value);
                }
            });

            if (profileImage) {
                formDataToSend.append("image", profileImage);
            }

            const response = await RegisterAPI(formDataToSend);
                navigate("/auth/login");
        } catch (err) {
            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = isDark
        ? "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        : "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

    const labelClass = isDark
        ? "block text-xs font-medium text-slate-300"
        : "block text-xs font-medium text-slate-600";

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-4">
                    <div className="relative w-24 h-24 mb-2 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <label className="cursor-pointer">
                        <span className={`text-xs font-medium ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-600 hover:text-sky-500'}`}>
                            {previewImage ? 'Change photo' : 'Upload photo'}
                        </span>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <label className={labelClass}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="John Doe"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className={labelClass}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className={`${inputClass} pr-10`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center px-1 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-cyan-300"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date of Birth */}
                    <div className="space-y-1">
                        <label className={labelClass}>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* Age (read-only) */}
                    <div className="space-y-1">
                        <label className={labelClass}>Age</label>
                        <input
                            type="text"
                            name="age"
                            value={formData.age ? `${formData.age} years` : ''}
                            readOnly
                            className={`${inputClass} bg-slate-50 dark:bg-slate-800 cursor-not-allowed`}
                            placeholder="Enter DOB to calculate"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-1">
                        <label className={labelClass}>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Height */}
                    <div className="space-y-1">
                        <label className={labelClass}>Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            step="0.1"
                            min="100"
                            max="250"
                            className={inputClass}
                            placeholder="175.5"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Weight */}
                    <div className="space-y-1">
                        <label className={labelClass}>Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            step="0.1"
                            min="30"
                            max="300"
                            className={inputClass}
                            placeholder="70.5"
                        />
                    </div>

                    {/* Gym Timing */}
                    <div className="space-y-1">
                        <label className={labelClass}>Preferred Gym Timing</label>
                        <select
                            name="gymTiming"
                            value={formData.gymTiming}
                            onChange={handleTimeChange}
                            className={inputClass}
                            required
                        >
                            <option value="06:00 AM">6:00 AM - 7:00 AM</option>
                            <option value="07:00 AM">7:00 AM - 8:00 AM</option>
                            <option value="08:00 AM">8:00 AM - 9:00 AM</option>
                            <option value="09:00 AM">9:00 AM - 10:00 AM</option>
                            <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                            <option value="04:00 PM">4:00 PM - 5:00 PM</option>
                            <option value="05:00 PM">5:00 PM - 6:00 PM</option>
                            <option value="06:00 PM">6:00 PM - 7:00 PM</option>
                            <option value="07:00 PM">7:00 PM - 8:00 PM</option>
                            <option value="08:00 PM">8:00 PM - 9:00 PM</option>
                        </select>
                    </div>
                </div>

                {/* BMI Display (read-only) */}
                {formData.BMI > 0 && (
                    <div className={`p-3 rounded-lg
  ${isDark ? "bg-slate-900/80 text-slate-200" : "bg-slate-100 text-slate-800"}
  text-center transition-colors`}
                    >
                        <p className="text-sm font-medium">
                            Your BMI: <span className="font-bold">{formData.BMI}</span>
                        </p>

                        <p className={`text-xs mt-1 
      ${isDark ? "text-cyan-400" : "text-slate-600"}
  `}>
                            {formData.BMI < 18.5 ? 'Underweight' :
                                formData.BMI < 25 ? 'Normal weight' :
                                    formData.BMI < 30 ? 'Overweight' : 'Obesity'}
                        </p>
                    </div>

                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-sky-600 text-white text-sm font-semibold py-2.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className={`font-medium ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-600 hover:text-sky-500'}`}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;