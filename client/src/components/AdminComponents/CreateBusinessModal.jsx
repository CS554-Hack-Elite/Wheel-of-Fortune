import React from "react";

export const CreateBusinessModal = ({ openModal, setOpenModal, children }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-75 ${
        openModal ? "" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col rounded-lg w-1/2 p-6 shadow-2xl bg-white">
          <div className="flex justify-end">
            <button
              className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
