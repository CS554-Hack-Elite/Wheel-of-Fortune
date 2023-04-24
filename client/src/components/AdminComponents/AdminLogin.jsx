import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";

import axios from "axios";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const checkCredentialsAndLogin = async () => {
    //TODO: validate creds

    const adminCreds = { username: username, password: password };

    try {
      const { data } = await axios.post("/admin/login", adminCreds);

      localStorage.setItem("adminToken", JSON.stringify(data));
      navigate("/admin-dashboard");
    } catch (e) {
      console.log("error");
    }
  };

  return (
    <div className="flex justify-center h-full">
      <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col w-full my-auto md:py-8 items-center rounded shadow-2xl ">
        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
          Admin Login
        </h2>

        <FormInput title="Username" type="name" changeAction={setUsername} />
        <FormInput
          title="Password"
          type="password"
          changeAction={setPassword}
        />

        <Button title="Login" clickAction={checkCredentialsAndLogin} />
      </div>
    </div>
  );
};
