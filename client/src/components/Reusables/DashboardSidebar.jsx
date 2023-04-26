import React from "react";
import { Link } from "react-router-dom";
import { DashboardSidebarButton } from "../Reusables/DashboardSidebarButton";

export const DashboardSidebar = ({ buttons }) => {
	function handleButtons(buttons) {
		return buttons.map((button) => {
			return <DashboardSidebarButton linkTo={button.linkTo} name={button.title} />;
		});
	}
	return (
		<div className="fixed w-32 h-screen p-4 bg-gradient-to-b from-blue-800 to-indigo-800 drop-shadow-md flex flex-col justify-between">
			<div className="flex flex-col items-center">
				{handleButtons(buttons)}
				<span className="border-b-2 border-indigo-200 w-full p-2"></span>
				<Link to="/logout">
					<div className="w-24 text-center bg-indigo-50 hover:bg-indigo-100 cursor-pointer my-4 p-3 rounded-lg inline-block">Logout</div>
				</Link>
			</div>
		</div>
	);
};
