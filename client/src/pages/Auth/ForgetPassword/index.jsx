import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { ForgotPasswordAPI } from '../../../services/ApiServices';

const ForgetPassword = () => {
	const navigate = useNavigate();
	const { isDark } = useTheme();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage('');
		setLoading(true);
		try {
			const res = await ForgotPasswordAPI({ email });
			setMessage(res?.message || 'OTP sent to your email');
			navigate('/auth/verify-otp', {
				state: { email },
				replace: false,
			});
		} catch (err) {
			setError(err?.error || err?.message || 'Failed to send OTP');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-1">
					<label
						className={
							isDark
								? 'block text-xs font-medium text-slate-300'
								: 'block text-xs font-medium text-slate-600'
						}
					>
						Enter your registered email
					</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={
							isDark
								? 'w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
								: 'w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
						}
						placeholder="you@example.com"
					/>
				</div>

				{error && (
					<p className="text-xs text-red-500">{error}</p>
				)}
				{message && !error && (
					<p className="text-xs text-emerald-500">{message}</p>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-sky-600 text-white text-sm font-semibold py-2.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
				>
					{loading ? 'Sending OTP...' : 'Send OTP'}
				</button>
			</form>
		</div>
	);
};

export default ForgetPassword;