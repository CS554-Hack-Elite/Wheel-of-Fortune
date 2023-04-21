import React from "react";

export const StastisticsCard = ({ value, title }) => {
  return (
    <div class="lg:col-span-1 col-span-1 bg-white flex justify-between p-4 rounded-lg shadow-lg">
      <div class="flex flex-col pt-2 pl-4">
        <p class="text-2xl font-bold">{value} </p>
        <p class="text-gray-600">{title}</p>
      </div>
    </div>
  );
};
