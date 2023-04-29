import React, { useState } from "react";
import { FormInput } from "../Reusables/FormInput";
import { Button } from "../Reusables/Button";

export const CreateCoupon = () => {
  const [couponName, setCouponName] = useState("");

  const createCoupon = () => {
    console.log("creating coupon");
  };

  return (
    <div className="flex justify-center h-full">
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Generate A Coupon
        </div>

        <FormInput
          title="Coupon Name"
          type="name"
          changeAction={setCouponName}
        />

        <FormInput
          title="Coupon Description"
          type="text"
          changeAction={setCouponName}
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
