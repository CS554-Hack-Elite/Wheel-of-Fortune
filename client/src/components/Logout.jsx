import React from "react";
import axios from "axios";

export const Logout = () => {
	try {
		axios.get("/logout");
		return <div>Logout</div>;
	} catch (error) {}
};
