import React, { useState } from "react";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";

export const CreateBusinessAdmin = () => {
  const [username, setUsername] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createBusinessAdmin = () => {
    console.log("created");
  };

  return (
    <div className="flex justify-center h-full">
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
          Create a Business Admin
        </h2>

        <FormInput title="Username" type="name" changeAction={setUsername} />

        <FormInput title="Email" type="email" changeAction={setEmail} />
        <FormInput
          title="Password"
          type="password"
          changeAction={setPassword}
        />
        <FormInput
          title="Business"
          type="text"
          changeAction={setBusinessName}
        />

        <div className="relative mb-4 w-4/5">
          <label for="file" className="leading-7 text-sm text-gray-600">
            Business Logo
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

        <Button title="Create Admin" clickAction={createBusinessAdmin} />
      </div>
    </div>
  );
};
