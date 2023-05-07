import React from "react";

export const DeleteBusinessConfirmationModal = ({ business }) => {
  return (
    <div>
      <div className=" mt-4 text-lg">
        Are you sure you want to delete {business.name} ? All the Coupons of the
        business will also be deleted{" "}
      </div>
    </div>
  );
};
