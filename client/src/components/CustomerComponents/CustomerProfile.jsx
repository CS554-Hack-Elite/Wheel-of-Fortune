import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { Loading } from "../Reusables/Loading";
import { buildToken } from "../../auth/tokenBuilder";
import axios from "axios";

export const CustomerProfile = () => {
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [customerDetails, setCustomerDetails] = useState({});
	const { currentUser } = useAuth();

	useEffect(() => {
		async function fetchCustomerDetails() {
			try {
				setLoading(true);
				const payloadHeader = await buildToken();
				const response = await axios.get("/users/get-customer", payloadHeader);
				setCustomerDetails(response.data);
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
			<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
				<Error message={errorMessage} />
			</CreateModal>
			<main className="h-full ml-32 w-full">
				<div className="h-[96vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-auto">
						<div className="flex justify-center text-4xl font-medium text-indigo-700 p-2">My Profile</div>
						<div className="profile h-max mx-4 md:mx-20 lg:mx-24 mt-24 p-10 bg-white bg-opacity-40 rounded-lg overflow-x-auto">
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl flex justify-end">Name:</div>
								<div className="nameValue mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl">
									{customerDetails.name ? customerDetails.name : "(Name not provided)"}
								</div>
							</div>
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl flex justify-end">Email:</div>
								<div className="nameValue mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl">
									{customerDetails.email ? customerDetails.email : "(Email not provided)"}
								</div>
							</div>
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl flex justify-end">Member Since:</div>
								<div className="nameValue mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl">
									{customerDetails.created_at ? customerDetails.created_at.split(",")[0] : "(Date not provided)"}
								</div>
							</div>
							<div className="name grid grid-cols-2">
								<div className="nameLabel mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl flex justify-end">Total Proofs Uploaded:</div>
								<div className="nameValue mx-4 text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl">
									{customerDetails.proof ? customerDetails.proof.length : "N/A"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
