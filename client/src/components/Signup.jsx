import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Reusables/Button";
import { FormInput } from "./Reusables/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { CreateModal } from "./Reusables/CreateModal";
import { Error } from "./Reusables/Error";
import helpers from "../auth/validation.js";

import axios from "axios";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(13);

  const { register, deleteUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const signupCustomer = async () => {
    const objKeys = ["email", "password", "name", "age"];

    try {
      setLoading(true);

      const payload = {
        name,
        email,
        age: age,
        password,
        google_authenticated: 2,
      };

      console.log(payload);

      objKeys.forEach((element) => {
        payload[element] = helpers.checkInput(
          element,
          payload[element],
          element + " of the customer",
          true
        );
      });

      console.log("data is valid");

      const user = await register(email, password);

      await axios.post("/users/register", payload);

      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      //TODO: delete user from db

      console.log("error in data");
      console.log(e);
      // deleteUser();
      setErrorModal(true);
      if (
        e.toString().includes("Firebase: Error (auth/email-already-in-use).")
      ) {
        setErrorMessage("Email is already in use");
      } else {
        setErrorMessage(
          e && e.response && e.response.data
            ? e.response.data.message
            : e.toString()
        );
      }
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center h-full">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>
      <div className="lg:w-1/3 md:w-1/2 bg-white bg-opacity-30 flex flex-col w-full my-auto md:py-8 items-center rounded shadow-2xl ">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Signup
        </div>

        <FormInput
          title="Name"
          type="text"
          value={name}
          changeAction={setName}
        />

        <FormInput
          title="Age"
          type="number"
          value={age}
          changeAction={setAge}
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

        <div className="grid lg:grid-row-3 gap-2 mt-4">
          <Button title="Signup" clickAction={signupCustomer} />
          <Button
            title="Already have an Account"
            clickAction={redirectToLogin}
          />
        </div>
      </div>
    </div>
  );
};
