import React, { lazy } from "react";
import { NotFoundPage } from "../component";
import { AuthLayout, SystemLayout } from "../layouts";
import useDocumentTitle from "../services/TitleServices";
import { useAuth } from "../context/AuthContext";
import { Exercise, Landing, Nutrition, WeightLogs, Profile, BodyPartExercises, WorkoutHistory, GroupExercise, GroupDetail, MemberDetail, GroupExerciseDetail, GroupBodyPartDetail } from "../pages/User";
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
				path: "/group-exercise/:groupId/body-part/:bodyPartId",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Group Body Part Detail - Gym Tracker">
								<GroupBodyPartDetail />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "/group-exercise/:groupId/exercise/:exerciseId",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Group Exercise Detail - Gym Tracker">
								<GroupExerciseDetail />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "exercise/:exerciseId/history",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Workout History - Gym Tracker">
								<WorkoutHistory />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "exercise/:id/exercises",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Body Part Exercises - Gym Tracker">
								<BodyPartExercises />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "/group-exercise",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Group Exercise - Gym Tracker">
								<GroupExercise />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "/group-exercise/:groupId",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Group Detail - Gym Tracker">
								<GroupDetail />
							</TitleWrapper>
						}
					/>
				),
			},
			{
				path: "/group-exercise/:groupId/member/:memberId",
				element: (
					<ProtectedRoute
						element={
							<TitleWrapper title="Member Detail - Gym Tracker">
								<MemberDetail />
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