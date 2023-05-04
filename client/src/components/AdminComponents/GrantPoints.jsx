import React, { useState } from "react";
import { FormInput } from "../Reusables/FormInput";
import { Button } from "../Reusables/Button";

export const GrantPoints = ({ request }) => {
  const [points, setPoints] = useState("");

  const grantPoints = () => {
    try {
      // TODO: Validate Credentials
      //TODO: Axios Request
    } catch (e) {}
    console.log("creating coupon");
  };

  return (
    <div className="flex justify-center h-full">
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Grant Points
        </div>

        <FormInput
          title="Points"
          type="text"
          value="qew"
          changeAction={setPoints}
        />

        <Button title="Grant Points" clickAction={grantPoints} />
      </div>
    </div>
  );
};
