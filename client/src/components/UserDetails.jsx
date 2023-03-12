import React, { useEffect, useState } from "react";
import axios from "axios";

export const UserDetails = () => {
  const [userDetails, setUserDetails] = useState("");

  const getUserDetails = (username) => {
    axios
      .get(`/users`)
      .then((res) => {
        setUserDetails(res.data.name);
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
    </div>
  );
};
