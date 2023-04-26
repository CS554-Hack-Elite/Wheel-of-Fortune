import React from "react";

export const Error = ({ message }) => {
  return (
    <div className="flex justify-center h-full">
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        Error: {message}
      </div>
    </div>
  );
};
