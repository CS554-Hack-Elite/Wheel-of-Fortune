import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import auth from "../auth/firebase";

import axios from "axios";
import { buildToken } from "../auth/tokenBuilder";

export const UserDetails = () => {
  const [userDetails, setUserDetails] = useState("");

  const { currentUser } = useAuth();

  // console.log(currentUser);

  const getUserDetails = async (username) => {
    const payloadHeader = await buildToken();

    //TODO: Handle firebase build error

    axios
      .get(`/users`, payloadHeader)
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((e) => {
        setUserDetails("Not found");
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div>
      <p>{userDetails}</p>
      <p>qweeqwqew</p>
    </div>
  );
};
