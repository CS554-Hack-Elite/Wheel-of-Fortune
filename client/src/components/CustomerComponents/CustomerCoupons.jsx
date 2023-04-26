import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import axios from "axios";

export const CustomerCoupons = () => {
	const [selfCoupons, setSelfCoupons] = useState([]);

	useEffect(() => {
		// async function fetchCoupons() {
		// 	const { data } = await axios.get(`/customer/${customerId}/coupons`);
		// 	setSelfCoupons(data);
		// }
		// fetchCoupons();
	});

	const handleCoupons = (coupons) => {
		return coupons.map((coupon) => {
			return (
				<div className="coupon bg-gradient-to-br from-indigo-800 via-indigo-600 to-violet-300 text-gray-200 rounded-lg my-4">
					<div className="flex justify-center pt-2 text-2xl">{coupon.name}</div>
					<div className="px-4 py-2 text-lg">Offer: {coupon.discount}</div>
					<div className="w-full bg-gray-200 text-black rounded-b-lg">
						<div className="p-4">{coupon.code}</div>
					</div>
				</div>
			);
		});
	};

	let coupons = [
		{
			id: 1,
			name: "Coupon 1",
			discount: "10% off",
			code: "COUPONHG345JHBDFG",
		},
		{
			id: 2,
			name: "Coupon 2",
			discount: "20% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 3,
			name: "Coupon 3",
			discount: "30% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 4,
			name: "Coupon 4",
			discount: "40% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 5,
			name: "Coupon 5",
			discount: "50% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 6,
			name: "Coupon 6",
			discount: "60% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 7,
			name: "Coupon 7",
			discount: "70% off",
			code: "COUPONHG345JHBSFG",
		},
		{
			id: 8,
			name: "Coupon 8",
			discount: "80% off",
			code: "COUPONHG345JHBSFG",
		},
	];

	return (
		<div className="max-h-fit flex">
			<DashboardSidebar buttons={[{ title: "Dashboard", linkTo: "/customer/dashboard" }]} />
			<main className="h-full ml-32 w-full">
				<div className="grid lg:grid-cols-2 gap-5 p-4">
					<StastisticsCard value="50" title="Points"></StastisticsCard>
					<StastisticsCard value="50" title="Total Coupons Won"></StastisticsCard>
				</div>
				<div className="h-[70vh] md:h-[85vh] lg:h-[85vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white overflow-auto">
						<div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">My Coupons</div>
						<div className="couponsList w-full p-8">{handleCoupons(coupons)}</div>
					</div>
					{/* <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto"></div> */}
				</div>
			</main>
		</div>
	);
};
