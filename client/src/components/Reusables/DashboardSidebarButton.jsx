import React from "react";
import { Link } from "react-router-dom";

export const DashboardSidebarButton = ({ linkTo, name }) => {
	return (
		<Link to={linkTo}>
			<div className="w-24 text-center bg-indigo-500 active:bg-indigo-400 text-white p-3 mb-4 rounded-lg inline-block">{name}</div>
		</Link>
	);
};
