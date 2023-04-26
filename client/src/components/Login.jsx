import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Reusables/Button";
import { FormInput } from "./Reusables/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { CreateModal } from "./Reusables/CreateModal";
import { Error } from "./Reusables/Error";
import { Loading } from "./Reusables/Loading";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, login, googleLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  console.log(currentUser);

  const loginCustomer = async () => {
    //TODO: validate creds

    // redirect

    try {
      setLoading(true);
      await login(email, password);
      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(e.toString());
    }
  };

  const loginCutomerByGoogle = async () => {
    try {
      setLoading(true);
      await googleLogin(email, password);
      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(e.toString());
    }
  };

  const redirectToSignup = () => {
    navigate("/signup");
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center h-full">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>

      <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col w-full my-auto md:py-8 items-center rounded shadow-2xl ">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Login
        </div>

        <FormInput title="Email" type="email" changeAction={setEmail} />

        <FormInput
          title="Password"
          type="password"
          changeAction={setPassword}
        />

        <div className="grid lg:grid-row-3 gap-2 mt-4">
          <Button title="Login" clickAction={loginCustomer} />

          <Button
            title="Login With Google"
            clickAction={loginCutomerByGoogle}
          />

          <Button title="Signup" clickAction={redirectToSignup} />
        </div>
      </div>
    </div>
  );
};
