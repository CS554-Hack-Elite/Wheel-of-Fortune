import React from "react";

export const Button = ({ title, clickAction, disabled = false, color = "indigo" }) => {
	return (
		<button
			disabled={disabled}
			className={`text-white bg-${color}-500 border-0 py-2 px-6 focus:outline-none hover:bg-${color}-600 rounded-lg text-lg`}
			onClick={() => {
				clickAction();
			}}
		>
			{title}
		</button>
	);
};
