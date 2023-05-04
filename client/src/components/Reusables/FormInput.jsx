import React from "react";

export const FormInput = ({ title, type, value, changeAction }) => {
	return (
		<div className="relative mb-4 w-4/5">
			<label className="leading-7 text-sm text-gray-800">
				{title}
				<input
					type={type}
					id={type}
					name={type}
					value={value}
					className="w-full bg-white bg-opacity-70 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
					onChange={(e) => {
						changeAction(e.target.value);
					}}
				/>
			</label>
		</div>
	);
};
