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
      <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded shadow-2xl">
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

        <Button title="Create Admin" clickAction={createBusinessAdmin} />
      </div>
    </div>
  );
};
