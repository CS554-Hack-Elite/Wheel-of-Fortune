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

        <Button title="Create Coupon" clickAction={createCoupon} />
      </div>
    </div>
  );
};
