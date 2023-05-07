import React, { useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { Homepage } from "./Homepage";

import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }) => {
	const { currentUser } = useAuth();

	if (currentUser) return children;

	return <Homepage />;
};
