import React, { useState } from "react";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Loading } from "../Reusables/Loading";

export const CustomerProfile = () => {
	const [loading, setLoading] = useState(false);

	if (loading) return <Loading />;

	return (
		<div className="max-h-fit flex">
			<DashboardSidebar
				buttons={[
					{ title: "Dashboard", linkTo: "/customer/dashboard" },
					{ title: "Coupons", linkTo: "/customer/coupons" },
					{ title: "Proofs", linkTo: "/customer/proof" },
				]}
			/>
			<main className="h-full ml-32 w-full">
				<div className="h-[96vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-auto">
						<div className="flex justify-center text-4xl font-medium text-indigo-700 p-2">My Profile</div>
						<div className="profile h-max mx-4 md:mx-20 lg:mx-24 mt-24 p-10 bg-white bg-opacity-40 rounded-lg overflow-x-auto">
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl flex justify-end">Name:</div>
								<div className="nameValue mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl">John Doe</div>
							</div>
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl flex justify-end">Email:</div>
								<div className="nameValue mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl">jdoe@gmail.com</div>
							</div>
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl flex justify-end">Member Since:</div>
								<div className="nameValue mx-4 text-lg md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl">04/23/2022</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
