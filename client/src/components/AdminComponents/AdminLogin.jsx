import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";

import axios from "axios";
import { clearLocalTokens, setLocalToken } from "../../auth/localTokenHandler";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [adminType, setAdminType] = useState("master");

  useEffect(() => {
    console.log(adminType);
  }, [adminType]);

  const navigate = useNavigate();

  const checkCredentialsAndLogin = async () => {
    //TODO: validate creds

    clearLocalTokens();
    const adminCreds = { email: email, password: password };

    console.log(adminCreds);
    console.log(adminType);

    if (adminType === "master") {
      try {
        const { data } = await axios.post("/admin/login", adminCreds);

        setLocalToken("adminToken", JSON.stringify(data));
        navigate("/admin-dashboard");
      } catch (e) {
        console.log("error");
      }
    } else {
      try {
        const { data } = await axios.post("/admin/business-login", adminCreds);

        setLocalToken("businessAdminToken", JSON.stringify(data));
        navigate("/admin-business-dashboard");
      } catch (e) {
        console.log(e.message);
      }
    }

    //TODO: post request to login as a business
  };

  return (
    <div className="flex justify-center h-full">
      <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col w-full my-auto md:py-8 items-center rounded shadow-2xl ">
        <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
          Admin Login
        </h2>

        <FormInput title="Username" type="name" changeAction={setEmail} />
        <FormInput
          title="Password"
          type="password"
          changeAction={setPassword}
        />

        <div className="mt-2 text-gray-600">
          Choose if you want to log in as master or a business
        </div>

        <div className="flex justify-around items-center w-3/4 mt-2 mb-5">
          <div className="flex justify-center items-center">
            <input
              type="radio"
              name="options"
              value="master"
              checked={adminType === "master"}
              onChange={() => setAdminType("master")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-gray-600">Master Admin</span>
          </div>
          <div className="flex justify-center items-center">
            <input
              type="radio"
              name="options"
              value="business"
              checked={adminType === "business"}
              onChange={() => setAdminType("business")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-gray-600">Business Admin</span>
          </div>
        </div>

        <Button title="Login" clickAction={checkCredentialsAndLogin} />
      </div>
    </div>
  );
};
