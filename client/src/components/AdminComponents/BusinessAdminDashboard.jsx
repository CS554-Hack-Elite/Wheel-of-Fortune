import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateCoupon } from "./CreateCoupon";

export const BusinessAdminDashboard = () => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("businessAdminToken");
    navigate("/admin-login");
  };

  useEffect(() => {
    if (!localStorage.getItem("businessAdminToken")) navigate("/admin-login");
  }, []);

  return (
    <div>
      <div className="flex">
        <CreateModal openModal={openModal} setOpenModal={setOpenModal}>
          <CreateCoupon />{" "}
        </CreateModal>
        <div className="fixed w-32 h-screen p-4 bg-white flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div
              className="bg-teal-600 text-white p-3 rounded-lg inline-block"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              {/* <img src="public/img/logo_white.svg" style="width:20px" /> */}
              Create Coupon
            </div>

            <span className="border-b-2 border-gray-200 w-full p-2"></span>

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
              <h1 className="text-3xl font-medium text-teal-600 p-2">
                Available Coupons
              </h1>
              <ul>
                {/* {{#each newInquiryList}}
							<li className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
								<div className="bg-teal-100 rounded-lg p-5">
									<img src="../public/img/solar.svg" className="text-purple-800 w-[40px]" />
								</div>
								<div className="pl-4">
									<p className="text-gray-800 font-bold">{{subject}}</p>
									<p className="text-gray-400 text-sm">{{message}}</p>
								</div>
								<span className="lg:flex md:hidden absolute right-6 text-md font-medium"><a href="/sales/generateaccount/{{_id}}"><button className="px-3 py-2 bg-emerald-600 text-white text-lg rounded-lg hover:bg-emerald-700 active:bg-emerald-500">Claim</button></a></span>
							</li>
						{{/each}} */}
              </ul>
            </div>
            <div className="md:col-span-2 p-4 lg:h-[90vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
              <h1 className="text-3xl font-medium text-teal-600 p-2">
                Customer Requests
              </h1>
              <ul>
                {/* {{#each ongoingInquiryList}}
							<li className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
								<div className="bg-yellow-100 rounded-lg p-5">
									<img src="../public/img/solar-panel.svg" className="text-purple-800 w-[40px]" />
								</div>
								<div className="pl-4">
									<p className="text-gray-800 font-bold">{{subject}}</p>
									<p className="text-gray-400 text-sm">{{message}}</p>
								</div>
								<p className="lg:flex md:hidden absolute right-6 text-md font-medium"><a href="/sales/inquirydetails/{{_id}}"><button className="px-3 py-2 bg-emerald-600 text-white text-lg rounded-lg hover:bg-emerald-700 active:bg-emerald-500">Details</button></a></p>
							</li>
						{{/each}} */}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
