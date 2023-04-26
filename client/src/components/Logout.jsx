import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
	const { logout } = useAuth();

	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		handleLogout();
	}, []);

	return <div>Logout</div>;
};
