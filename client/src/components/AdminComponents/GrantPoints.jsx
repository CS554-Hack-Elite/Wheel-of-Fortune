import React, { useState } from "react";
import { FormInput } from "../Reusables/FormInput";
import { Button } from "../Reusables/Button";
import helpers from "../../auth/validation.js";
import axios from "axios";

const objKeys = ["proof_id", "status", "points", "email"];

export const GrantPoints = ({ requestDetails }) => {
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("approve");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const acceptOrReject = async (action) => {
    try {
      setLoading(true);

      //TODO: fix numerical handling of points in validation 2

      const payload = {
        proof_id: requestDetails._id,
        status: status === "approve" ? 2 : 3,
        points: status === "approve" ? parseInt(points) : 0,
        email: requestDetails.customer_email,
      };

      // console.log(payload);

      objKeys.forEach((element) => {
        payload[element] = helpers.checkInput(
          element,
          payload[element],
          element + " of the coupon",
          true
        );
      });

      const proofRequest = await axios.post("/users/update-proof", payload);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(
        e && e.response && e.response.data
          ? e.response.data.message
          : e.toString()
      );
    }
  };

  return (
    <div className="flex justify-center h-full">
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Grant Points
        </div>

        <div className="flex justify-around items-center w-3/4 mt-2 mb-5">
          <div className="flex justify-center items-center">
            <input
              type="radio"
              name="options"
              value="approve"
              checked={status === "approve"}
              onChange={() => setStatus("approve")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-gray-600">Approve</span>
          </div>
          <div className="flex justify-center items-center">
            <input
              type="radio"
              name="options"
              value="reject"
              checked={status === "reject"}
              onChange={() => setStatus("reject")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-gray-600">Reject</span>
          </div>
        </div>

        {status === "approve" ? (
          <div className=" flex flex-col items-center justify-center w-full">
            <FormInput
              title="Choose between 1-5 Points"
              type="number"
              value={points}
              changeAction={setPoints}
            />
            <Button title="Grant Points" clickAction={acceptOrReject} />
          </div>
        ) : (
          <Button title="Reject Request" clickAction={acceptOrReject} />
        )}

        {/* <Button title="Grant Points" clickAction={grantPoints} /> */}
      </div>
    </div>
  );
};
