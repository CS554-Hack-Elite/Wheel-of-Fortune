import React, { useState } from "react";
import axios from "axios";
import { Button } from "../Reusables/Button";
import { Error } from "../Reusables/Error";

export const DeleteBusinessConfirmationModal = ({ business, setOpenModal }) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deleteBusinsess = async () => {
    try {
      await axios.delete("/business/delete/" + business._id);

      setOpenModal(false);
    } catch (e) {
      console.log(e);

      setError(true);
      setErrorMessage(
        e && e.response && e.response.data
          ? e.response.data.message
          : e.toString()
      );
    }
  };

  if (error)
    return (
      <div>
        <Error message={errorMessage}></Error>
      </div>
    );

  return (
    <div className=" flex flex-col mt-4 items-center justify-around">
      <div className=" mt-4 text-lg">
        Are you sure you want to delete {business.name}? All the Coupons of the
        business will also be deleted.....
      </div>

      <div className="  mt-4 ">
        <Button
          title="Delete Business"
          clickAction={deleteBusinsess}
          color="red"
        />
      </div>
    </div>
  );
};
