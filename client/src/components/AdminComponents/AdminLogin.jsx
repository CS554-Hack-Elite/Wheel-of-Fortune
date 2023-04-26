import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";
import { Error } from "../Reusables/Error";

import axios from "axios";
import { clearLocalTokens, setLocalToken } from "../../auth/localTokenHandler";
import { CreateModal } from "../Reusables/CreateModal";
import { Login } from "../Login";
import { Loading } from "../Reusables/Loading";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [adminType, setAdminType] = useState("master");

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const { data } = await axios.post("/admin/login", adminCreds);

        setLoading(false);

        setLocalToken("adminToken", JSON.stringify(data));
        navigate("/admin-dashboard");
      } catch (e) {
        setLoading(false);
        setErrorModal(true);
        setErrorMessage(e.toString());
      }
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post("/admin/business-login", adminCreds);

        setLoading(false);

        setLocalToken("businessAdminToken", JSON.stringify(data));
        navigate("/admin-business-dashboard");
      } catch (e) {
        setLoading(false);
        setErrorModal(true);
        setErrorMessage(e.toString());
      }
    }

    //TODO: post request to login as a business
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center h-full">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>

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
