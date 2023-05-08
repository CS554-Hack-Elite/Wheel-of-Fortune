import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { buildToken } from "../../auth/tokenBuilder";
import axios from "axios";

export const CustomerCoupons = () => {
	const [selfCoupons, setSelfCoupons] = useState([]);
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [customerDetails, setCustomerDetails] = useState({});

	useEffect(() => {
		async function fetchCustomerDetails() {
			try {
				setLoading(true);
				const payloadHeader = await buildToken();
				const response = await axios.get("/users/get-customer", payloadHeader);
				setCustomerDetails(response.data);
				console.log(response.data);
				setLoading(false);
			} catch (e) {
				setLoading(false);
				setErrorModal(true);
				setErrorMessage(e && e.error ? e.error : e.toString());
				console.log(e);
			}
		}

		fetchCustomerDetails();
	}, []);

	const handleCoupons = (coupons) => {
		if (coupons && coupons.length > 0) {
			return coupons.map((coupon) => {
				return (
					<div key={coupon._id} className="coupon col-span-1 bg-indigo-800 text-slate-200 rounded-lg my-4 overflow-x-auto">
						<div className="flex justify-center pt-2 text-xl">{coupon.name}</div>
						<span>
							<div className="px-4 py-2 text-lg">Offer: {coupon.coupon_name}</div>
						</span>
						<div className="w-full bg-gray-200 text-black rounded-b-lg">
							<div className="p-4">{coupon.coupon_code}</div>
						</div>
					</div>
				);
			});
		} else {
			return (
				<div className="coupon col-span-1 md:col-span-3 lg:col-span-4 xl:col-span-4 bg-indigo-800 text-slate-200 rounded-lg my-4 overflow-x-auto">
					<div className="flex justify-center p-4 text-xl">No coupons won yet</div>
				</div>
			);
		}
	};

	let coupons = [
		{
			id: 1,
			businessName: "Walmart",
			discount: "10% off",
			code: "COUPONHG345JHBDFG",
		},
		{
			id: 2,
			businessName: "Target",
			discount: "20% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 3,
			businessName: "Nike",
			discount: "30% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 4,
			businessName: "Adidas",
			discount: "40% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 5,
			businessName: "Samsung",
			discount: "50% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 6,
			businessName: "Gamestop",
			discount: "60% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 7,
			businessName: "Sony",
			discount: "70% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 8,
			businessName: "IKEA",
			discount: "80% off",
			code: "COUPONHG345JHBSFG",
		},
	];

	if (loading) return <Loading />;

	return (
		<div className="max-h-fit flex">
			<DashboardSidebar
				key={"sidebar"}
				buttons={[
					{ title: "Dashboard", linkTo: "/customer/dashboard" },
					{ title: "Proofs", linkTo: "/customer/proof" },
					{ title: "Profile", linkTo: "/customer/account" },
				]}
			/>
			<main className="h-full ml-32 w-full">
				<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
					<Error message={errorMessage} />
				</CreateModal>
				<div className="grid lg:grid-cols-2 gap-5 p-4">
					<StastisticsCard value={customerDetails && customerDetails.points} title="Points" />
					<StastisticsCard value={customerDetails && customerDetails.coupons ? customerDetails.coupons.length : "N/A"} title="Total Coupons Won" />
				</div>
				<div className="h-[70vh] md:h-[85vh] lg:h-[85vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-auto">
						<div className="flex justify-center text-3xl font-medium text-indigo-700 p-2">My Coupons</div>
						<div className="couponsList w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-8">
							{customerDetails.coupons && handleCoupons(customerDetails.coupons)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
