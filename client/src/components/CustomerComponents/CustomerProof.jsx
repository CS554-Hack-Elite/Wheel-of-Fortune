import React from "react";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";

export const CustomerProof = () => {
	const handlePointsRender = (points) => {
		if (points) {
			return <div className="px-4 py-2 text-s">Points Earned: {points}</div>;
		} else {
			return <div className="px-4 py-2 text-s">No Points Earned</div>;
		}
	};
	const renderProofList = (proofList) => {
		return proofList.map((proof) => {
			return (
				<div className="h-fit col-span-1 coupon bg-gradient-to-br from-indigo-800 via-indigo-600 to-violet-300 text-slate-200 rounded-lg my-4">
					<img src={proof.image} className="h-60 w-full object-cover pt-2 px-4 rounded-2xl" alt={proof.name} />
					<div className="flex justify-center pt-2 text-2xl">{proof.name}</div>
					<div className="proofStatus px-4">Current status: {proof.status}</div>
					<span className="flex justify-start mr-6 mt-1">
						<span className="h-0.5 bg-gradient-to-r from-indigo-200 w-full"></span>
					</span>
					<span>{handlePointsRender(proof.points)}</span>
				</div>
			);
		});
	};
	const proofList = [
		{
			name: "Proof 1",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Pending",
			points: null,
		},
		{
			name: "Proof 2",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Approved",
			points: 2,
		},
		{
			name: "Proof 3",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Rejected",
			points: 0,
		},
		{
			name: "Proof 4",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Pending",
			points: null,
		},
		{
			name: "Proof 5",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Approved",
			points: 4,
		},
		{
			name: "Proof 6",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Rejected",
			points: 0,
		},
		{
			name: "Proof 7",
			image: process.env.PUBLIC_URL + "/bill-placeholder.jpg",
			status: "Approved",
			points: 5,
		},
	];
	return (
		<div>
			<DashboardSidebar
				buttons={[
					{ title: "Dashboard", linkTo: "/customer/dashboard" },
					{ title: "Coupons", linkTo: "/customer/coupons" },
				]}
			/>
			<main className="h-full ml-32">
				<div className="h-[98vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-y-auto">
						<div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">Proof History</div>
						<div className="proofList grid grid-cols-3 gap-4">{renderProofList(proofList)}</div>
					</div>
					{/* <div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white overflow-y-auto"></div> */}
				</div>
			</main>
		</div>
	);
};
