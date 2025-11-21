import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { VerifyOtpAPI } from '../../../services/ApiServices';

const VerifyOtp = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { isDark } = useTheme();
	const initialEmail = location?.state?.email || '';
	const [email, setEmail] = useState(initialEmail);
	const [otp, setOtp] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!email && location?.state?.email) {
			setEmail(location.state.email);
		}
	}, [location, email]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await VerifyOtpAPI({ email, otp });
			navigate('/auth/reset-password', {
				state: { email, otp },
				replace: true,
			});
		} catch (err) {
			setError(err?.error || err?.message || 'OTP verification failed');
		}
	};

	const handleOtpChange = (index, value) => {
		// Allow only digits
		const digit = value.replace(/[^0-9]/g, '').slice(-1);
		let next = otp.split('');
		next[index] = digit;
		setOtp(next.join(''));
	};

	const otpBoxes = Array.from({ length: 6 }, (_, idx) => otp[idx] || '');

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
						Email
					</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled
						className={
							isDark
								? 'w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-500 placeholder:text-slate-600 outline-none'
								: 'w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 placeholder:text-slate-400 outline-none'
						}
					/>
				</div>
				<div className="space-y-1">
					<label
						className={
							isDark
								? 'block text-xs font-medium text-slate-300'
								: 'block text-xs font-medium text-slate-600'
						}
					>
						Enter OTP
					</label>
					<div className="flex gap-2 justify-center pt-2">
						{otpBoxes.map((val, idx) => (
							<input
								key={idx}
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={val}
								onChange={(e) => handleOtpChange(idx, e.target.value)}
								className={
									isDark
										? 'w-10 h-10 text-center rounded-md border border-slate-700 bg-slate-900/70 text-sm text-slate-100 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
										: 'w-10 h-10 text-center rounded-md border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
								}
							/>
						))}
					</div>
				</div>
				{error && (
					<p className="text-xs text-red-500">{error}</p>
				)}
				<button
					type="submit"
					className="w-full rounded-lg bg-sky-600 text-white text-sm font-semibold py-2.5 mt-2 hover:bg-sky-700 transition-colors"
				>
					Verify OTP
				</button>
			</form>
		</div>
	);
};

export default VerifyOtp;
