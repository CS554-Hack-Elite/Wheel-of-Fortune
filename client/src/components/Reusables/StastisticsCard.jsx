import React from "react";

export const StastisticsCard = ({ value, title }) => {
	return (
		<div className="lg:col-span-1 col-span-1 bg-white flex justify-between p-4 rounded-lg shadow-lg">
			<div className="flex flex-col pt-2 pl-4">
				<p className="text-2xl font-bold">{value} </p>
				<p className="text-gray-600">{title}</p>
			</div>
		</div>
	);
};
