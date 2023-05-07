// Referenced from: https://github.com/effectussoftware/react-custom-roulette/blob/master/README.md
import React from "react";
import { useState, useEffect } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Wheel } from "react-custom-roulette";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { buildToken } from "../../auth/tokenBuilder";
import axios from "axios";

export const CustomerDashboard = () => {
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [customerDetails, setCustomerDetails] = useState({});
	const [couponOptions, setCouponOptions] = useState([{}]);
	const [coupons, setCoupons] = useState([]);
	const [reward, setReward] = useState({});
	const [showReward, setShowReward] = useState(false);
	const [timer, setTimer] = useState(0);
	const [mustSpin, setMustSpin] = useState(false);
	const [prizeNumber, setPrizeNumber] = useState(0);
	const [prizeNumberId, setPrizeNumberId] = useState("");

	// axios call to fetch coupons from /api/coupons route using useEffect hook
	useEffect(() => {
		async function fetchAvailableCoupons() {
			try {
				setLoading(true);
				const payloadHeader = await buildToken();
				const response = await axios.get("/users/coupons", payloadHeader);
				const wheelCouponNames = [];
				// response.data.availableCoupons.map((coupon) => {
				// 	wheelCouponNames.push({ option: coupon.name.toString() });
				// });
				if (response.data.availableCoupons.length > 0) {
					for (let coupon of response.data.availableCoupons) {
						wheelCouponNames.push({ option: coupon.name.toString() });
					}
					setCoupons(response.data.availableCoupons);
				}
				// wheelCouponNames.push({ option: "none" });
				// console.log("wheelCouponNames", wheelCouponNames);
				setCouponOptions(wheelCouponNames);
				console.log("coupons", wheelCouponNames);
				setLoading(false);
			} catch (e) {
				setLoading(false);
				setErrorModal(true);
				setErrorMessage(e && e.error ? e.error : e.toString());
				console.log(e);
			}
		}
		fetchAvailableCoupons();
	}, []);

	async function fetchCustomerDetails() {
		try {
			// setLoading(true);
			const payloadHeader = await buildToken();
			console.log("payload header", payloadHeader);
			const response = await axios.get("/users/get-customer", payloadHeader);
			setCustomerDetails(response.data);
			// setLoading(false);
		} catch (e) {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.data && e.data.error ? e.data.error : e.toString());
			console.log(e);
		}
	}
	useEffect(() => {
		fetchCustomerDetails();
	}, []);

	const handleSpinClick = () => {
		if (!mustSpin) {
			const newPrizeNumber = Math.floor(Math.random() * couponOptions.length);
			console.log("newPrizeNumber", newPrizeNumber);
			console.log("couponsObjects", coupons);
			if (isNaN(newPrizeNumber)) {
				setPrizeNumber(1);
			} else {
				setPrizeNumber(newPrizeNumber);
			}
			for (let coupon of coupons) {
				if (coupon.name === couponOptions[newPrizeNumber].option) {
					setPrizeNumberId(coupon._id);
				}
			}
			setMustSpin(true);
		}
	};

	const handleWheel = (data) => {
		if (data.length > 1) {
			return (
				<div className="grid grid-cols-1">
					<Wheel
						mustStartSpinning={mustSpin}
						prizeNumber={prizeNumber}
						data={data}
						backgroundColors={["#a5b4fc", "#4f46e5"]}
						textColors={["#ffffff"]}
						innerBorderWidth={4}
						innerRadius={4}
						fontSize={16}
						onStopSpinning={async () => {
							setMustSpin(false);
							setReward(data[prizeNumber]);
							console.log("prize number id", prizeNumberId);
							try {
								const payloadHeader = await buildToken();
								await axios.post("/users/update-points", { coupon_id: prizeNumberId }, payloadHeader);
								fetchCustomerDetails();
							} catch (e) {
								setLoading(false);
								setErrorModal(true);
								setErrorMessage(e && e.error ? e.error : e.toString());
								console.log(e);
							}
							setShowReward(true);
						}}
						className="mx-auto min-w-max"
					/>
					{customerDetails.points > 0 && (
						<button
							className="w-full col-span-1 bg-indigo-600 text-white rounded-lg p-4 mt-8 text-2xl hover:bg-indigo-500 hover:scale-105 active:bg-indigo-700"
							onClick={handleSpinClick}
						>
							SPIN
						</button>
					)}
				</div>
			);
		} else {
			return (
				<div className="grid grid-cols-1">
					<div className="w-full col-span-1 border-indigo-600 border-2 text-gray-800 rounded-lg p-4 mt-8 text-2xl">No Coupons Available</div>
				</div>
			);
		}
	};

	const handleShowReward = (showReward) => {
		if (showReward) {
			return (
				<div className="prize-won flex justify-center mt-12">
					<div className="text-2xl py-2 px-4">Congratulations! You've won: </div>
					<div className="py-2 px-4 border-2 border-indigo-500 rounded-lg">
						<div className="text-gray-800 text-xl">{reward.option}</div>
					</div>
				</div>
			);
		}
	};

	// const handleSendReward = () => {

	// }

	// const data = [
	// 	{ option: "100% OFF" },
	// 	{ option: "20% OFF" },
	// 	{ option: "Buy 1 Get 1 Free" },
	// 	{ option: "30% OFF" },
	// 	{ option: "50% OFF" },
	// 	{ option: "60% OFF" },
	// 	{ option: "70% OFF" },
	// 	{ option: "80% OFF" },
	// 	{ option: "90% OFF" },
	// ];

	// const data = [];

	if (loading) return <Loading />;

	return (
		<div className="max-h-fit flex">
			<DashboardSidebar
				buttons={[
					{ title: "Coupons", linkTo: "/customer/coupons" },
					{ title: "Proofs", linkTo: "/customer/proof" },
					{ title: "Profile", linkTo: "/customer/account" },
				]}
			/>
			<main className="h-full ml-32 w-full">
				<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
					<Error message={errorMessage} />
				</CreateModal>
				<div className="grid lg:grid-cols-2 gap-5 p-4">
					<StastisticsCard value={customerDetails.points && customerDetails.points} title="Points"></StastisticsCard>
					{console.log("customer points", customerDetails.points)}
					<StastisticsCard value={customerDetails.coupons ? customerDetails.coupons.length : "N/A"} title="Total Coupons Won"></StastisticsCard>
				</div>

				<div className="h-[85vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-x-auto">
						{console.log(customerDetails)}
						<div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">Spin the Wheel:</div>
						<div className="wheel flex justify-center mt-10">{couponOptions && handleWheel(couponOptions)}</div>
						{handleShowReward(showReward)}
					</div>
					{/* <div className="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto"></div> */}
				</div>
			</main>
		</div>
	);
};
