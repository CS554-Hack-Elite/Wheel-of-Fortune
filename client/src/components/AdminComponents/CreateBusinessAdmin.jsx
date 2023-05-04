import React, { useState } from "react";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";
import helpers from "../../auth/validation.js";
import axios from "axios";
import { CreateModal } from "../Reusables/CreateModal";
import { Error } from "../Reusables/Error";

export const CreateBusinessAdmin = () => {
  const [name, setName] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //TODO: button color change on disabled
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createBusinessAdmin = async () => {
    // TODO: Validate Credentials

    const objKeys = ["name", "email", "password"];

    try {
      setLoading(true);
      const payload = {
        name,
        email,
        password,
        logo: "qweqwe",
      };

      objKeys.forEach((element) => {
        payload[element] = helpers.checkInput(
          element,
          payload[element],
          element + " of the admin",
          true
        );
      });

      console.log("data is valid");
      console.log(payload);
      await axios.post("/admin/register-business-admin", payload);
      setLoading(false);
    } catch (e) {
      console.log("error in data");
      console.log(e);

      setErrorModal(true);
      setErrorMessage(e && e.error ? e.error : e.toString());
    }

    console.log("created");
  };

  return (
    <div className="flex justify-center h-full">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>
      <div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Create a Business Admin
        </div>

        <FormInput
          title="Admin Name"
          type="text"
          value={name}
          changeAction={setName}
        />

        <FormInput
          title="Email"
          type="email"
          value={email}
          changeAction={setEmail}
        />

        <FormInput
          title="Password"
          type="password"
          value={password}
          changeAction={setPassword}
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
            onChange={(e) => {}}
          />
        </div>

        <Button title="Create Admin" clickAction={createBusinessAdmin} />
      </div>
    </div>
  );
};
