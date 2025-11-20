import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

const AppRoutes = () => {
	const element = useRoutes(routes);
	return element;
};

const App = () => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;
