import React, { useEffect, useState } from "react";
import { FormInput } from "../Reusables/FormInput";
import { Button } from "../Reusables/Button";
import helpers from "../../auth/validation.js";
import axios from "axios";
import { CreateModal } from "../Reusables/CreateModal";
import { Error } from "../Reusables/Error";

export const CreateCoupon = ({ businessAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [couponDescription, setCouponDescription] = useState("");
  const [couponMaxAllocation, setCouponMaxAllocation] = useState("");

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const objKeys = ["name", "description", "max_allocation", "business_id"];

  const createCoupon = async () => {
    try {
      setLoading(true);

      const payload = {
        name: couponName,
        description: couponDescription,
        max_allocation: couponMaxAllocation.toString(),
        image: "qweqwe",
        business_id: businessAdmin.business_id,
      };

      // console.log(typeof payload.max_allocation);

      objKeys.forEach((element) => {
        payload[element] = helpers.checkInput(
          element,
          payload[element],
          element + " of the coupon",
          true
        );
      });

      console.log(payload);

      await axios.post("/business/generate_coupon", payload);

      //TODO: Show message on creation and clear the input fields

      setLoading(false);
    } catch (e) {
      console.log(e);
      setErrorModal(true);
      setErrorMessage(
        e && e.response && e.response.data
          ? e.response.data.message
          : e.toString()
      );
    }
    console.log("creating coupon");
  };

  return (
    <div className="flex justify-center h-full">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>

      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Generate A Coupon
        </div>

        <FormInput
          title="Coupon Name"
          type="text"
          value={couponName}
          changeAction={setCouponName}
        />

        <FormInput
          title="Coupon Description"
          type="text"
          value={couponDescription}
          changeAction={setCouponDescription}
        />

        <FormInput
          title="Coupon Max Allocation"
          type="number"
          value={couponMaxAllocation}
          changeAction={setCouponMaxAllocation}
        />

        <div className="relative mb-4 w-4/5">
          <label for="file" className="leading-7 text-sm text-gray-600">
            Coupon Image
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="w-full bg-white rounded border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 leading-8 transition-colors duration-200 ease-in-out"
            // onChange={(e) => {
            //   changeAction(e.target.value);
            // }}
          />
        </div>

        <Button title="Create Coupon" clickAction={createCoupon} />
      </div>
    </div>
  );
};
