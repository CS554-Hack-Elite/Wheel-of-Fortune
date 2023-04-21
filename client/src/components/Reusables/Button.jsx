import React from "react";

export const Button = ({ title, clickAction }) => {
  return (
    <button
      className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      onClick={() => {
        clickAction();
      }}
    >
      {title}
    </button>
  );
};
