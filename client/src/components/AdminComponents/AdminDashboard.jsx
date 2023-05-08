import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { Link, useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateBusinessAdmin } from "./CreateBusinessAdmin";
import { clearLocalTokens } from "../../auth/localTokenHandler";
import axios from "axios";
import { Loading } from "../Reusables/Loading";
import { DeleteBusinessConfirmationModal } from "./DeleteBusinessConfirmationModal";
import { Error } from "../Reusables/Error";

export const AdminDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedBusinessForDeletion, setSelectedBusinessForDeletion] =
    useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // individual states

  const [couponsNotFetched, setCouponsNotFetched] = useState(true);
  const [businessesNotFetched, setBusinessesNotFetched] = useState(true);
  const [customersNotFetched, setCustomersNotFetched] = useState(true);

  const getCouponData = async () => {
    try {
      // throw "qweqwe";
      const couponData = await axios.get("/business/coupons/");
      setCoupons(couponData.data.ListOfCoupons);
      setCouponsNotFetched(false);
    } catch (e) {
      setCouponsNotFetched(true);
    }
  };

  const getBusinessData = async () => {
    try {
      // throw "qweqewwqe";
      const businessData = await axios.get("/business/list/");
      setBusinesses(businessData.data.businessData);
      setBusinessesNotFetched(false);
    } catch (e) {
      setBusinessesNotFetched(true);
    }
  };

  const getCustomerData = async () => {
    try {
      // throw "qewqwe";
      const customerData = await axios.get("/business/customer/list");
      setCustomers(customerData.data.ListOfCustomer);
      setCustomersNotFetched(false);
    } catch (e) {
      setCustomersNotFetched(true);
    }
  };

  const getData = async () => {
    setLoading(true);
    await getCouponData();
    await getBusinessData();
    await getCustomerData();
    setLoading(false);
    // try {
    //   setLoading(true);

    //   // const couponData = await axios.get("/business/coupons/");

    //   // const businessData = await axios.get("/business/list/");

    //   // const customerData = await axios.get("/business/customer/list");

    //   // setCoupons(couponData.data.ListOfCoupons);
    //   // setBusinesses(businessData.data.businessData);
    //   // setCustomers(customerData.data.ListOfCustomer);
    //   // setLoading(false);
    // } catch (e) {
    //   setLoading(false);
    //   setErrorModal(true);
    //   setErrorMessage(
    //     e && e.response && e.response.data
    //       ? e.response.data.message
    //       : e.toString()
    //   );
    // }
  };

  const deleteBusiness = (business) => {
    setSelectedBusinessForDeletion(business);
    setOpenDeleteModal(true);
  };

  const buildCouponCard = (coupon) => {
    return (
      <li className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
        <div className="bg-teal-100 rounded-lg p-5">
          <img
            src="../public/img/solar.svg"
            className="text-purple-800 w-[40px]"
          />
        </div>
        <div className="pl-4">
          <p className="text-gray-800 font-bold">{coupon.name} </p>
          <p className="text-gray-400 text-sm">{coupon.description}</p>
        </div>
        <span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
          <div className="px-3 py-2 bg-gray-600 text-white text-lg rounded-lg ">
            Max Coupons: {coupon.max_allocation}
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

  const buildbusinessCard = (business) => {
    return (
      <li className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
        <div className="bg-teal-100 rounded-lg p-5">
          <img
          // src={"../images/1683567288478-AOT.jpg"}
          // className="text-purple-800 w-[40px]"
          />
        </div>
        <div className="pl-4">
          <p className="text-gray-800 font-bold">{business.name} </p>
        </div>
        <button
          className="px-3 py-2 bg-red-600 ml-auto text-white text-lg rounded-lg hover:bg-red-700 active:bg-emerald-500"
          onClick={() => {
            deleteBusiness(business);
          }}
        >
          Delete Business
        </button>
      </li>
    );
  };

  const renderbusinesses = () => {
    const allBusinesses = [];

    for (let business of businesses) {
      allBusinesses.push(buildbusinessCard(business));
    }

    return allBusinesses;
  };

  const logoutAdmin = async () => {
    // TODO: send logout to server

    await axios.get("/admin/logout");
    clearLocalTokens();
    navigate("/admin-login");
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) navigate("/admin-login");
    getData();
  }, []);

  useEffect(() => {
    if (!openModal) getBusinessData();
  }, [openModal]);

  useEffect(() => {
    if (!openDeleteModal) getBusinessData();
  }, [openDeleteModal]);

  if (loading) return <Loading />;

  return (
    <div class="flex">
      <CreateModal openModal={openModal} setOpenModal={setOpenModal}>
        <CreateBusinessAdmin modalChanged={openModal} />{" "}
      </CreateModal>
      <CreateModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      >
        <DeleteBusinessConfirmationModal
          business={selectedBusinessForDeletion}
          modalChanged={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
        />{" "}
      </CreateModal>
      <div class="fixed w-32 h-screen p-4 bg-white flex flex-col justify-between">
        <div class="flex flex-col items-center">
          <div
            class="bg-teal-600 text-white p-3 rounded-lg inline-block"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            {/* <img src="public/img/logo_white.svg" style="width:20px" /> */}
            Create Admin
          </div>

          <span class="border-b-2 border-gray-200 w-full p-2"></span>

          <div
            class="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block"
            onClick={() => {
              logoutAdmin();
            }}
          >
            Logout
          </div>
        </div>
      </div>
      <main class=" ml-32 w-full">
        <div class="grid lg:grid-cols-3 gap-5 p-4">
          <StastisticsCard
            value={couponsNotFetched ? "Not Found" : coupons.length}
            title="Number of Coupons"
          ></StastisticsCard>
          <StastisticsCard
            value={customersNotFetched ? "Not Found" : customers.length}
            title="Number of Customers"
          ></StastisticsCard>
          <StastisticsCard
            value={businessesNotFetched ? "Not Found" : businesses.length}
            title="Number of Businesses"
          ></StastisticsCard>
        </div>

        <div class="p-4 grid md:grid-cols-4 grid-cols-1 gap-4">
          <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
            <div class="text-3xl font-medium text-teal-600 p-2">
              Top 10 Coupons
            </div>
            <ul>
              {couponsNotFetched ? (
                <div class="text-xl text-teal-600 p-2">Not Found</div>
              ) : (
                renderCoupons()
              )}
            </ul>
          </div>
          <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
            <div class="text-3xl font-medium text-teal-600 p-2">Businesses</div>
            <ul>
              {businessesNotFetched ? (
                <div class="text-xl text-teal-600 p-2">Not Found</div>
              ) : (
                renderbusinesses()
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
