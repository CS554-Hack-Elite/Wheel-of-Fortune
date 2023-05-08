import React from "react";

export const ImageView = ({ imageSrc }) => {
	return (
		<div className="flex h-full justify-center bg-white bg-opacity-20">
			<div className=" flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
				<img src={imageSrc} alt="Receipt" />
			</div>
		</div>
	);
};
