import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Reusables/Button";
import { FormInput } from "./Reusables/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { CreateModal } from "./Reusables/CreateModal";
import { Error } from "./Reusables/Error";
import { Loading } from "./Reusables/Loading";
import axios from "axios";
import helpers from "../auth/validation.js";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, login, googleLogin, deleteUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const objKeys = ["email", "password"];

  const loginCustomer = async () => {
    try {
      setLoading(true);

      const payload = {
        email: email,
        password: password,
      };

      objKeys.forEach((element) => {
        payload[element] = helpers.checkInput(
          element,
          payload[element],
          element + " of the customer",
          true
        );
      });

      console.log("data is valid");
      await login(email, password);
      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(e && e.error ? e.error : e.toString());

      if (e.toString().includes("Firebase: Error (auth/wrong-password)")) {
        setErrorMessage(
          "You entered the wrong password please try again / If you have logged in using a google account before click on log in via google"
        );
      } else {
        setErrorMessage(
          e && e.response && e.response.data
            ? e.response.data.message
            : e.toString()
        );
      }
    }
  };

  const loginCutomerByGoogle = async () => {
    try {
      const user = await googleLogin(email, password);

      const payload = {
        name: user.user.displayName,
        email: user.user.email,
        google_authenticated: 1,
      };

      await axios.post("/users/register", payload);

      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      console.log(e);
      // deleteUser();
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
    <div className="flex justify-center h-full bg-opacity-30">
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>

      <div className="lg:w-1/3 md:w-1/2 bg-white bg-opacity-30 flex flex-col w-full my-auto md:py-8 items-center rounded-lg shadow-2xl ">
        <div className="text-gray-900 text-lg mb-1 font-medium title-font">
          Login
        </div>

        <FormInput
          title="Email"
          type="email"
          value={email}
          changeAction={setEmail}
        />

        <FormInput
          title="Password"
          type="password"
          valye={password}
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
