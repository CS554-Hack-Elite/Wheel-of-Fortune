import React from "react";

export const ImageView = ({ imageSrc }) => {
	console.log(imageSrc);
	return (
		<div className="flex h-full justify-center px-4 py-2 my-4 bg-gray-200 rounded-lg overflow-y-auto">
			<div className="flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
				<img src={imageSrc} alt="Receipt" />
			</div>
		</div>
	);
};
