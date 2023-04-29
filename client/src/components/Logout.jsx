import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "./Reusables/CreateModal";
import { Error } from "./Reusables/Error";
import { Loading } from "./Reusables/Loading";

export const Logout = () => {
  const { logout } = useAuth();

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setLoading(false);
      navigate("/customer/dashboard");
    } catch (e) {
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(e.toString(e.toString()));
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
        <Error message={errorMessage} />
      </CreateModal>
      Logout
    </div>
  );
};
