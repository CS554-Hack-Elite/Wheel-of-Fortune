import React from "react";
import { useState, useEffect } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Wheel } from "react-custom-roulette";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { buildToken } from "../../auth/tokenBuilder";
import { TimeoutComponent } from "../Reusables/TimeoutComponent";
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
	const [mustSpin, setMustSpin] = useState(false);
	const [allowSpin, setAllowSpin] = useState(false);
	const [prizeNumber, setPrizeNumber] = useState(0);
	const [prizeNumberId, setPrizeNumberId] = useState("");

	async function fetchAvailableCoupons() {
		try {
			const payloadHeader = await buildToken();
			const response = await axios.get("/users/coupons", payloadHeader);
			const wheelCouponNames = [];
			if (response.data.availableCoupons.length > 0) {
				for (let coupon of response.data.availableCoupons) {
					wheelCouponNames.push({ option: coupon.name.toString() });
				}
				console.log(response.data.availableCoupons);
				setCoupons(response.data.availableCoupons);
			}
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
	useEffect(() => {
		setLoading(true);
		fetchAvailableCoupons();
	}, []);

	async function fetchCustomerDetails() {
		try {
			const payloadHeader = await buildToken();
			console.log("Payload header: ", payloadHeader);
			const response = await axios.get("/users/get-customer", payloadHeader);
			if (response.data.points > 0) {
				setAllowSpin(true);
			} else {
				setAllowSpin(false);
			}
			setCustomerDetails(response.data);
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
							setAllowSpin(false);
							setReward(data[prizeNumber]);
							console.log("prize number id", prizeNumberId);
							try {
								const payloadHeader = await buildToken();
								await axios.post("/users/update-points", { coupon_id: prizeNumberId }, payloadHeader);
								fetchCustomerDetails();
								fetchAvailableCoupons();
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
					{!mustSpin && allowSpin ? (
						<button
							onClick={handleSpinClick}
							className="w-full col-span-1 bg-indigo-600 text-white rounded-lg p-4 mt-8 text-2xl hover:bg-indigo-500 hover:scale-105 active:bg-indigo-700"
						>
							SPIN
						</button>
					) : (
						<button
							onClick={handleSpinClick}
							className="w-full col-span-1 bg-gray-500 bg-opacity-80 text-white rounded-lg p-4 mt-8 text-2xl"
							disabled={true}
						>
							SPIN
						</button>
					)}
				</div>
			);
		} else {
			return (
				<div className="grid grid-cols-1">
					<div className="w-full col-span-1 border-indigo-600 border-2 text-gray-800 rounded-lg p-4 mt-8 text-2xl">
						More than 1 Coupons not Available
					</div>
				</div>
			);
		}
	};

	const handleShowReward = () => {
		return (
			<div className="prize-won flex justify-center mt-12">
				<div className="text-2xl py-2 px-4">Congratulations! You've won: </div>
				<div className="py-2 px-4 border-2 border-indigo-500 rounded-lg">
					<div className="text-gray-800 text-xl">{reward.option}</div>
				</div>
			</div>
		);
	};

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
					<StastisticsCard value={customerDetails.points && customerDetails.points ? customerDetails.points : 0} title="Points"></StastisticsCard>
					{console.log("customer points", customerDetails.points)}
					<StastisticsCard
						value={customerDetails.coupons && customerDetails.coupons ? customerDetails.coupons.length : "N/A"}
						title="Total Coupons Won"
					></StastisticsCard>
				</div>

				<div className="h-[85vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-x-auto">
						{console.log(customerDetails)}
						<div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">Spin the Wheel:</div>
						<div className="wheel flex justify-center mt-10">{couponOptions && handleWheel(couponOptions)}</div>
						<TimeoutComponent show={showReward} setShow={setShowReward} seconds={3000}>
							{handleShowReward()}
						</TimeoutComponent>
					</div>
				</div>
			</main>
		</div>
	);
};
