import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateCoupon } from "./CreateCoupon";
import { GrantPoints } from "./GrantPoints";
import axios from "axios";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";

export const BusinessAdminDashboard = () => {
  const navigate = useNavigate();

  const businessToken = localStorage.getItem("businessAdminToken");
  if (!businessToken) navigate("/admin-login");

  const [business, setBusiness] = useState(JSON.parse(businessToken));

  const [openModal, setOpenModal] = useState(false);
  const [pointsModal, setPointsModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestDetails, setRequestDetails] = useState({});
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // console.log(requests);

  const buildProofs = (customers) => {
    const allProofs = [];

    for (let customer of customers) {
      for (let currentProof of customer.proof) {
        allProofs.push({
          ...currentProof,
          customer_name: customer.name,
          customer_email: customer.email,
        });
      }
    }

    return allProofs;
  };

  const getData = async () => {
    try {
      setLoading(true);

      const payload = {
        business_id: business.businessAdmin.business_id,
      };

      // TODO: add the buisness_id to the payload
      const requestData = await axios.post("/business/get-proof", payload);

      const couponData = await axios.get(
        "business/coupons/" + payload.business_id
      );

      setRequests(buildProofs(requestData.data.proof));
      setCoupons(couponData.data.ListOfCoupons);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      setErrorModal(true);
      setErrorMessage(
        e && e.response && e.response.data
          ? e.response.data.message
          : e.toString()
      );
    }
  };

  const assignPoints = (customerRequest) => {
    setPointsModal(true);
    setRequestDetails(customerRequest);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("businessAdminToken");
    navigate("/admin-login");
  };

  const checkStatus = (status, request) => {
    if (status === 1) {
      return (
        <button
          className="px-3 py-2 bg-blue-600 text-white text-lg rounded-lg hover:bg-emerald-700 active:bg-emerald-500 w-full"
          onClick={() => {
            assignPoints(request);
          }}
        >
          Assign Points
        </button>
      );
    } else if (status === 2) {
      return (
        <span className="lg:flex md:hidden ml-auto text-md font-medium w-full">
          <div className="px-3 py-2 bg-green-600 text-white text-lg rounded-lg w-full text-center">
            Approved
          </div>
        </span>
      );
    } else {
      return (
        <span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
          <div className="px-3 py-2 bg-red-600 text-white text-lg rounded-lg w-full text-center">
            Rejected
          </div>
        </span>
      );
    }
  };

  const buildRequestCard = (request) => {
    return (
      <li
        key={request._id}
        className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center"
      >
        <div className="bg-yellow-100 rounded-lg p-5">
          <img
          // src="../public/img/solar-panel.svg"
          // className="text-purple-800 w-[40px]"
          />
        </div>
        <div className="pl-4">
          <div className="text-gray-800 font-bold">
            {request.customer_name}'s Request{" "}
          </div>
          <div className="text-gray-400 text-sm">{request.customer_email}</div>
        </div>
        <div className="lg:flex md:hidden ml-auto right-6 text-md font-medium w-40">
          {checkStatus(request.status, request)}
        </div>
      </li>
    );
  };

  const renderRequests = () => {
    const allRequest = [];

    for (let request of requests) {
      allRequest.push(buildRequestCard(request));
    }

    return allRequest;
  };

  const buildCouponCard = (coupon) => {
    // TODO: Remaining coupons
    return (
      <li
        key={coupon._id}
        className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center"
      >
        <div className="bg-teal-100 rounded-lg p-5">
          <img
          // src="../public/img/solar.svg"
          // className="text-purple-800 w-[40px]"
          />
        </div>
        <div className="pl-4">
          <p className="text-gray-800 font-bold">{coupon.name}</p>
          <p className="text-gray-400 text-sm">{coupon.description}</p>
        </div>
        <span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
          <div className="px-3 py-2 bg-gray-600 text-white text-lg rounded-lg ">
            Coupons Remaining: 50/{coupon.max_allocation}
          </div>
        </span>
      </li>
    );
  };

  const renderCoupons = () => {
    const allCoupons = [];

    for (let coupon of coupons) {
      allCoupons.push(buildCouponCard(coupon));
    }
    return allCoupons;
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex">
        <CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
          <Error message={errorMessage} />
        </CreateModal>

        <CreateModal openModal={openModal} setOpenModal={setOpenModal}>
          <CreateCoupon
            modalChanged={openModal}
            businessAdmin={business.businessAdmin}
          />{" "}
        </CreateModal>

        <CreateModal openModal={pointsModal} setOpenModal={setPointsModal}>
          <GrantPoints requestDetails={requestDetails} />{" "}
        </CreateModal>
        <div className="fixed w-32 h-screen p-4 bg-white flex flex-col justify-between">
          <div className="flex flex-col items-center">
            {/* <span className="border-b-2 border-gray-200 w-full p-2"></span> */}

            <div
              className="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block"
              onClick={() => {
                logoutAdmin();
              }}
            >
              {/* <img src="public/img/logout.svg" style="width:20px" /> */}
              Logout
            </div>
          </div>
        </div>
        <main className=" ml-32 w-full">
          {/* <div className="grid lg:grid-cols-3 gap-5 p-4 bg-blue-400">
            <StastisticsCard
              value="50"
              title="Number of Coupons"
            ></StastisticsCard>
            <StastisticsCard
              value="50"
              title="Number of Customers"
            ></StastisticsCard>
            <StastisticsCard
              value="50"
              title="Number of Businesses"
            ></StastisticsCard>
          </div> */}

          <div className="p-4 grid md:grid-cols-4 grid-cols-1 gap-4 my-10">
            <div className="md:col-span-2 p-4 lg:h-[90vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-medium text-teal-600 p-2">
                  Available Coupons
                </div>
                <div
                  className="bg-teal-600 text-white al p-3 rounded-lg inline-block hover:bg-teal-700 active:bg-teal-500"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  {/* <img src="public/img/logo_white.svg" style="width:20px" /> */}
                  Create Coupon
                </div>
              </div>

              <ul>{renderCoupons()}</ul>
            </div>
            <div className="md:col-span-2 p-4 lg:h-[90vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
              <div className="text-3xl font-medium text-teal-600 p-2">
                Customer Requests
              </div>
              <ul>{renderRequests()}</ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
