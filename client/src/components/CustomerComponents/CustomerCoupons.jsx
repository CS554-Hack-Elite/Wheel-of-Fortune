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
				<div className="coupon col-span-1 bg-indigo-800 text-slate-200 rounded-lg my-4 overflow-x-auto">
					<div className="flex justify-center pt-2 text-2xl">{coupon.businessName}</div>
					<span>
						<div className="px-4 py-2 text-lg">Offer: {coupon.discount}</div>
					</span>
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

	return (
		<div className="max-h-fit flex">
			<DashboardSidebar
				buttons={[
					{ title: "Dashboard", linkTo: "/customer/dashboard" },
					{ title: "Proofs", linkTo: "/customer/proof" },
					{ title: "Profile", linkTo: "/customer/account" },
				]}
			/>
			<main className="h-full ml-32 w-full">
				<div className="grid lg:grid-cols-2 gap-5 p-4">
					<StastisticsCard value="50" title="Points"></StastisticsCard>
					<StastisticsCard value="50" title="Total Coupons Won"></StastisticsCard>
				</div>
				<div className="h-[70vh] md:h-[85vh] lg:h-[85vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-auto">
						<div className="flex justify-center text-3xl font-medium text-indigo-700 p-2">My Coupons</div>
						<div className="couponsList w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-8">{handleCoupons(coupons)}</div>
					</div>
				</div>
			</main>
		</div>
	);
};
