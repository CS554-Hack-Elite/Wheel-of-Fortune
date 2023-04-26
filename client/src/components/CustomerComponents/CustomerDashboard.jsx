// Referenced from: https://github.com/effectussoftware/react-custom-roulette/blob/master/README.md
import React from "react";
import { useState, useEffect } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
export const CustomerDashboard = () => {
  const [Coupons, setCoupons] = useState([{}]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  // axios call to fetch coupons from /api/coupons route using useEffect hook
  useEffect(() => {
    // async function fetchCoupons() {
    //   const { data } = await axios.get("/getallcoupons");
    //   setCoupons(data);
    // }
    // fetchCoupons();
  });

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };
  const handleWheel = (data) => {
    if (data.length > 0) {
      return (
        <div className="grid grid-cols-1">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={["#a5b4fc", "#4f46e5"]}
            textColors={["#ffffff"]}
            onStopSpinning={() => {
              setMustSpin(false);
            }}
          />
          <button
            className="w-full col-span-1 bg-indigo-600 text-white rounded-lg p-4 mt-8 text-2xl hover:bg-indigo-500 hover:scale-105 active:bg-indigo-700"
            onClick={handleSpinClick}
          >
            SPIN
          </button>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const data = [
    { option: "0" },
    { option: "1" },
    { option: "2" },
    { option: "4" },
  ];
  return (
    <div className="max-h-fit flex">
      <DashboardSidebar
        buttons={[{ title: "Coupons", linkTo: "/customer/coupons" }]}
      />
      <main className="h-full ml-32 w-full">
        <div className="grid lg:grid-cols-2 gap-5 p-4">
          <StastisticsCard value="50" title="Points"></StastisticsCard>
          <StastisticsCard
            value="50"
            title="Total Coupons Won"
          ></StastisticsCard>
        </div>

        <div className="pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
          <div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white">
            <div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">
              Spin the Wheel
            </div>
            <div className="wheel flex justify-center mt-10">
              {handleWheel(data)}
            </div>
          </div>
          {/* <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto"></div> */}
        </div>
      </main>
    </div>
  );
};
