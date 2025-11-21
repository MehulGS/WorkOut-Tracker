import React, { lazy } from "react";
import { NotFoundPage } from "../component";
import { AuthLayout, SystemLayout } from "../layouts";
import useDocumentTitle from "../services/TitleServices";
import { useAuth } from "../context/AuthContext";
import { Exercise, Landing, Nutrition, WeightLogs, Profile } from "../pages/User";
import { Login, Register, ForgetPassword, VerifyOtp, ResetPassword } from "../pages/Auth";

const TitleWrapper = ({ title, children }) => {
	useDocumentTitle(title);
	return children;
};

const ProtectedRoute = ({ element }) => {
	const { isAuthenticated } = useAuth();
	if (!isAuthenticated) {
		return <Landing />;
	}
	return element;
};

const routes = [
	{
		path: "/",
		element: <Landing />,
	},
	{
		path: "/auth",
		element: <AuthLayout />,
		children: [
			{
				path: "login",
				element: (
					<TitleWrapper title="Login - Gym Tracker">
						<Login />
					</TitleWrapper>
				),
			},
			{
				path: "register",
				element: (
					<TitleWrapper title="Register - Gym Tracker">
						<Register />
					</TitleWrapper>
				),
			},
			{
				path: "forgot-password",
				element: (
					<TitleWrapper title="Forgot Password - Gym Tracker">
						<ForgetPassword />
					</TitleWrapper>
				),
			},
			{
				path: "verify-otp",
				element: (
					<TitleWrapper title="Verify OTP - Gym Tracker">
						<VerifyOtp />
					</TitleWrapper>
				),
			},
			{
				path: "reset-password",
				element: (
					<TitleWrapper title="Reset Password - Gym Tracker">
						<ResetPassword />
					</TitleWrapper>
				),
			},
		]
	},
	{
		path: "/",
		element: <SystemLayout />,
		children: [
			{
				path: "exercise",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Exercise Detail - Gym Tracker">
								<Exercise />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "nutrition",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Nutrition Tracker - Gym Tracker">
								<Nutrition />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "logs",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Weight Logs - Gym Tracker">
								<WeightLogs />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Profile - Gym Tracker">
								<Profile />
							</TitleWrapper>
						}
					/>
				),
			},
		],
	},
	{
		path: "*",
		element: (
			<TitleWrapper title="Page Not Found - Gym Tracker">
				<NotFoundPage />
			</TitleWrapper>
		),
	},
];

export default routes;