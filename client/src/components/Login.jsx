import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Reusables/Button";
import { FormInput } from "./Reusables/FormInput";
import { useAuth } from "../contexts/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, login, googleLogin } = useAuth();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log(currentUser);

  const loginCustomer = async () => {
    //TODO: validate creds

    // redirect

    try {
      setLoading(true);
      await login(email, password);
      console.log(currentUser);
      navigate("/");
    } catch (e) {
      alert("Failed to register");
    }

    setLoading(false);
  };

  const loginCutomerByGoogle = async () => {
    try {
      setLoading(true);
      await googleLogin(email, password);
      console.log(currentUser);
      navigate("/");
    } catch (e) {
      alert("Failed to register");
    }

    setLoading(false);
  };

  const redirectToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex justify-center h-full">
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
