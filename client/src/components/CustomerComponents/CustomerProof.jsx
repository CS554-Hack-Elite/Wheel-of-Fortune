import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { buildToken } from "../../auth/tokenBuilder";

import axios from "axios";

export const CustomerProof = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  // const [proofList, setProofList] = useState([]);
  const [businessList, setBusinessList] = useState([]);
  const [uploadProof, setUploadProof] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  useEffect(() => {
    async function fetchBusinessList() {
      try {
        setLoading(true);
        const payloadHeader = await buildToken();
        const businessArray = await axios.get("/business/list", payloadHeader);
        setBusinessList(businessArray.data.businessData);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setErrorModal(true);
        setErrorMessage(e && e.error ? e.error : e.toString());
        console.log(e);
      }
    }
    fetchBusinessList();
  }, []);

  const handlePointsRender = (points) => {
    if (points) {
      return <div className="px-4 py-2 text-s">Points Earned: {points}</div>;
    } else {
      return <div className="px-4 py-2 text-s">No Points Earned</div>;
    }
  };
  const renderProofList = (proofList) => {
    return proofList.map((proof) => {
      return (
        <div className="h-fit col-span-1 coupon bg-indigo-800 text-slate-200 rounded-lg my-4">
          <Link to="#" className="imageOverview">
            <img
              src={proof.image}
              className="h-60 w-full object-cover rounded-t-lg"
              alt={proof.name}
            />
          </Link>
          <div className="flex justify-center pt-2 text-2xl">{proof.name}</div>
          <div className="proofStatus px-4">Current status: {proof.status}</div>
          <span className="flex justify-start mr-6 mt-1">
            <span className="h-0.5 bg-gradient-to-r from-indigo-200 w-full"></span>
          </span>
          <span>{handlePointsRender(proof.points)}</span>
        </div>
      );
    });
  };

  const handleUploadProof = () => {
    return (
      <div className="z-10 fixed inset-0 h-screen bg-black bg-opacity-30">
        <div className="form absolute h-fit w-1/2 left-1/4 right-1/4 mt-24 py-8 bg-white bg-opacity-80 backdrop-blur-md rounded-lg">
          <div className="m-4 flex justify-center text-xl md:text-3xl lg:text-3xl xl:text-4xl">
            Upload Proof
          </div>
          <div className="formFields grid grid-cols-1">
            <button
              className="absolute top-0 right-0 m-4 py-2 px-4 bg-red-500 text-white hover:bg-red-600 active:bg-red-500 rounded-lg"
              onClick={() => {
                setUploadProof(false);
              }}
            >
              Close
            </button>
            <label htmlFor="proof" className="text-2xl col-span-1 m-4">
              Select Business:
              <select
                name="business_id"
                id="businessNameList"
                className="mx-4 px-2 py-1 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                onChange={(e) => setBusinessId(e.target.value)}
              >
                {console.log(businessId)}
                <option key="0" value="">
                  Select an option
                </option>
                {businessList
                  ? businessList.map((business) => {
                      return (
                        <option key={business._id} value={business._id}>
                          {business.name}
                        </option>
                      );
                    })
                  : null}
              </select>
            </label>
            <label htmlFor="proofImage" className="text-2xl col-span-1 m-4">
              Upload a receipt:
              <input
                class="text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mx-4"
                id="image"
                name="image"
                type="file"
                onChange={(e) => setUploadedImage(e.target.files[0])}
              />
              {console.log(uploadedImage)}
            </label>
            <button
              type="submit"
              className="w-fit py-2 px-4 mx-auto bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-500 rounded-lg"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("proof", uploadedImage);
    formData.append("email", currentUser.email);
    const payloadHeader = await buildToken();
    console.log(payloadHeader);
    try {
      const res = await axios.post(
        "/users/upload-proof",
        formData,
        payloadHeader
      );
      console.log(res);
      setBusinessId("");
      setUploadedImage("");
      console.log(businessId);
      console.log(uploadedImage);
      setUploadProof(false);
      setLoading(false);
    } catch (e) {
      setUploadProof(false);
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(e && e.error ? e.error : e.toString());
      console.log(e);
    }
  };

  let proofList = [
    {
      name: "Proof 1",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Pending",
      points: null,
    },
    {
      name: "Proof 2",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Approved",
      points: 2,
    },
    {
      name: "Proof 3",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Rejected",
      points: 0,
    },
    {
      name: "Proof 4",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Pending",
      points: null,
    },
    {
      name: "Proof 5",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Approved",
      points: 4,
    },
    {
      name: "Proof 6",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Rejected",
      points: 0,
    },
    {
      name: "Proof 7",
      image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
      status: "Approved",
      points: 5,
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <DashboardSidebar
        buttons={[
          { title: "Dashboard", linkTo: "/customer/dashboard" },
          { title: "Coupons", linkTo: "/customer/coupons" },
          { title: "Profile", linkTo: "/customer/account" },
        ]}
      />
      <main className="h-full ml-32">
        {uploadProof ? handleUploadProof() : null}
        <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
          <Error message={errorMessage} />
        </CreateModal>
        {console.log()}
        <div className="h-[98vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
          <div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-y-auto">
            <div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">
              Proof History
            </div>
            <span>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-500 rounded-lg py-2 px-4 text-white"
                onClick={() => {
                  setUploadProof(true);
                }}
              >
                Upload Proof
              </button>
            </span>
            <div className="proofList grid grid-cols-3 gap-4">
              {renderProofList(proofList)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
