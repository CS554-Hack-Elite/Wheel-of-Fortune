import React, { useEffect, useState } from "react";
import { Button } from "../Reusables/Button";
import { FormInput } from "../Reusables/FormInput";
import helpers from "../../auth/validation.js";
import axios from "axios";
import { CreateModal } from "../Reusables/CreateModal";
import { Error } from "../Reusables/Error";
import { TimeoutComponent } from "../Reusables/TimeoutComponent";

export const CreateBusinessAdmin = ({ modalChanged }) => {
  const [name, setName] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessImage, setBusinessImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showCreated, setShowCreated] = useState(false);

  const createBusinessAdmin = async () => {
    const objKeys = ["name", "email", "password"];

    //TODO: Handle image
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

      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("password", payload.password);
      formData.append("logo", businessImage);

      const payloadHeader = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        "/admin/register-business-admin",
        formData,
        payloadHeader
      );
      setLoading(false);
      setShowCreated(true);
    } catch (e) {
      console.log("error in data");
      console.log(e);
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(
        e && e.response && e.response.data
          ? e.response.data.message
          : e.toString()
      );
    }
  };

  useEffect(() => {
    setLoading(false);
    setName("");
    setBusinessName("");
    setEmail("");
    setPassword("");
    setErrorModal(false);
    setErrorMessage("");
  }, [modalChanged]);

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
          <label htmlFor="BusinessLogo" className="text-sm col-span-1">
            Business Logo
            <input
              className="text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mx-4"
              id="image"
              name="logo"
              type="file"
              onChange={(e) => setBusinessImage(e.target.files[0])}
              required
            />
          </label>
        </div>

        {!loading ? (
          <Button title="Create Admin" clickAction={createBusinessAdmin} />
        ) : (
          <Button
            title="Creating...."
            disabled={true}
            color="gray"
            clickAction={createBusinessAdmin}
          />
        )}

        <TimeoutComponent show={showCreated} setShow={setShowCreated}>
          <div className="text-green-700 text-lg mb-1 mt-5 font-medium title-font">
            Business Created!!
          </div>
        </TimeoutComponent>
      </div>
    </div>
  );
};
