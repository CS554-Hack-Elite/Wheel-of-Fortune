import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { Link, useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateBusinessAdmin } from "./CreateBusinessAdmin";
import { clearLocalTokens } from "../../auth/localTokenHandler";

export const AdminDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const logoutAdmin = () => {
    clearLocalTokens();
    navigate("/admin-login");
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) navigate("/admin-login");
  }, []);

  return (
    <div class="flex">
      <CreateModal openModal={openModal} setOpenModal={setOpenModal}>
        <CreateBusinessAdmin />{" "}
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
            {/* <img src="public/img/logout.svg" style="width:20px" /> */}
            Logout
          </div>
        </div>
      </div>
      <main class=" ml-32 w-full">
        <div class="grid lg:grid-cols-3 gap-5 p-4">
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
        </div>

        <div class="p-4 grid md:grid-cols-4 grid-cols-1 gap-4">
          <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
            <h1 class="text-3xl font-medium text-teal-600 p-2">
              Top 10 Coupons
            </h1>
            <ul>
              {/* {{#each newInquiryList}}
							<li class="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
								<div class="bg-teal-100 rounded-lg p-5">
									<img src="../public/img/solar.svg" class="text-purple-800 w-[40px]" />
								</div>
								<div class="pl-4">
									<p class="text-gray-800 font-bold">{{subject}}</p>
									<p class="text-gray-400 text-sm">{{message}}</p>
								</div>
								<span class="lg:flex md:hidden absolute right-6 text-md font-medium"><a href="/sales/generateaccount/{{_id}}"><button class="px-3 py-2 bg-emerald-600 text-white text-lg rounded-lg hover:bg-emerald-700 active:bg-emerald-500">Claim</button></a></span>
							</li>
						{{/each}} */}
            </ul>
          </div>
          <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto">
            <h1 class="text-3xl font-medium text-teal-600 p-2">Businesses</h1>
            <ul>
              {/* {{#each ongoingInquiryList}}
							<li class="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center">
								<div class="bg-yellow-100 rounded-lg p-5">
									<img src="../public/img/solar-panel.svg" class="text-purple-800 w-[40px]" />
								</div>
								<div class="pl-4">
									<p class="text-gray-800 font-bold">{{subject}}</p>
									<p class="text-gray-400 text-sm">{{message}}</p>
								</div>
								<p class="lg:flex md:hidden absolute right-6 text-md font-medium"><a href="/sales/inquirydetails/{{_id}}"><button class="px-3 py-2 bg-emerald-600 text-white text-lg rounded-lg hover:bg-emerald-700 active:bg-emerald-500">Details</button></a></p>
							</li>
						{{/each}} */}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
