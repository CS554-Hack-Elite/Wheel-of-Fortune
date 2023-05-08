import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "../Reusables/DashboardSidebar";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { CreateModal } from "../Reusables/CreateModal";
import { buildToken } from "../../auth/tokenBuilder";
import { ImageView } from "../Reusables/ImageView";
import axios from "axios";

export const CustomerProof = () => {
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [customerDetails, setCustomerDetails] = useState({});
	const [customerProofList, setCustomerProofList] = useState([]);
	const [businessList, setBusinessList] = useState([]);
	const [uploadProof, setUploadProof] = useState(false);
	const [businessId, setBusinessId] = useState(null);
	const [uploadedImage, setUploadedImage] = useState(null);
	const [receiptView, setReceiptView] = useState(false);
	const [receiptViewSrc, setReceiptViewSrc] = useState("");

	async function fetchBusinessList() {
		try {
			const payloadHeader = await buildToken();
			const businessArray = await axios.get("/users/business-list", payloadHeader);
			setBusinessList(businessArray.data.businessData);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.error ? e.error : e.toString());
			console.log(e);
		}
	}

	useEffect(() => {
		fetchBusinessList();
	}, []);

	async function fetchCustomerDetails() {
		try {
			// setLoading(true);
			const payloadHeader = await buildToken();
			const response = await axios.get("/users/get-customer", payloadHeader);
			setCustomerDetails(response.data);
			setCustomerProofList(response.data.proof);
			// console.log(response.data);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.error ? e.error : e.toString());
			console.log(e);
		}
	}
	useEffect(() => {
		fetchCustomerDetails();
	}, []);

	const getBusinessName = (businessId) => {
		let business = businessList.find((business) => business._id === businessId);
		// console.log(business);
		return business && business.name ? business.name : "N/A";
	};

	const checkImageExists = (image) => {
		try {
			require("../../../images");
			require("../../../images/proof/" + image);
			return true;
		} catch (error) {
			return false;
		}
	};

	const renderProofList = (proofList) => {
		if (proofList && proofList.length > 0) {
			return proofList.map((proof) => {
				return (
					<div key={proof.name} className="h-fit col-span-1 coupon bg-indigo-800 text-slate-200 rounded-lg my-4">
						{proof.proof && checkImageExists(proof.proof) ? (
							<img
								src={require("../../../images/proof/" + proof.proof)}
								className="w-full h-80 object-cover rounded-t-lg hover:pointer"
								alt={proof.coupon_name}
							/>
						) : (
							<img
								src="https://placehold.co/320@3x?text=Image+Unavailable&font=open-sans"
								className="w-full h-80 object-cover rounded-t-lg"
								alt={proof.coupon_name}
							/>
						)}
						<div className="flex justify-center pb-2 pt-2 text-xl">Uploaded for: {getBusinessName(proof.business_id)}</div>
						<div className="proofStatus px-4 py-2">
							Current status:{" "}
							{proof.status && proof.status === 1 ? "Pending" : proof.status === 2 ? "Approved" : proof.status === 3 ? "Rejected" : "N/A"}
						</div>
						<span className="flex justify-start mr-6 mt-1">
							<span className="h-0.5 bg-gradient-to-r from-indigo-200 w-full"></span>
						</span>
						<span className="py-2">
							<div className="px-4 py-2 text-s">Points Earned: {proof.points_earned ? proof.points_earned : "None"}</div>
						</span>
					</div>
				);
			});
		} else {
			return (
				<div className="coupon col-span-1 md:col-span-3 lg:col-span-4 xl:col-span-4 bg-indigo-800 text-slate-200 rounded-lg my-4 overflow-x-auto">
					<div className="flex justify-center p-4 text-xl">No proofs uploaded</div>
				</div>
			);
		}
	};

	const handleUploadProof = () => {
		return (
			<div className="z-10 fixed inset-0 h-screen bg-black bg-opacity-30">
				<div className="form absolute h-fit w-1/2 left-1/4 right-1/4 mt-24 py-8 bg-white bg-opacity-80 backdrop-blur-md rounded-lg">
					<div className="m-4 flex justify-center text-xl md:text-3xl lg:text-3xl xl:text-4xl">Upload a receipt</div>
					<div className="formFields grid grid-cols-1">
						<button
							className="absolute top-0 right-0 m-4 py-2 px-4 bg-red-500 text-white hover:bg-red-600 active:bg-red-500 rounded-lg"
							onClick={() => {
								setUploadProof(false);
							}}
						>
							Close
						</button>
						<label htmlFor="proof" className="text-xl col-span-1 m-4">
							Select Business:
							<select
								name="business_id"
								id="businessNameList"
								className="mx-4 px-2 py-1 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
								onChange={(e) => setBusinessId(e.target.value)}
								required
							>
								{/* {console.log(businessId)} */}
								<option key="" value="">
									Select an option
								</option>
								{businessList
									? businessList.map((business) => {
											return (
												<option key={business._id} value={business._id}>
													{business.name}
												</option>
											);
									  })
									: null}
							</select>
						</label>
						<label htmlFor="proofImage" className="text-xl col-span-1 m-4">
							Select Receipt:
							<input
								className="text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mx-4"
								id="image"
								name="image"
								type="file"
								onChange={(e) => setUploadedImage(e.target.files[0])}
								required
							/>
						</label>
						<button
							type="submit"
							className="w-fit py-2 px-4 mx-auto bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-500 rounded-lg"
							onClick={() => {
								handleSubmit();
							}}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		);
	};

	const handleSubmit = async () => {
		setLoading(true);
		if (businessId === null) {
			setErrorModal(true);
			setErrorMessage("Please select a business");
			setLoading(false);
			return;
		}
		if (uploadedImage === null) {
			setErrorModal(true);
			setErrorMessage("Please upload a receipt");
			setLoading(false);
			return;
		}
		const formData = new FormData();
		formData.append("business_id", businessId);
		formData.append("proof", uploadedImage);
		console.log(uploadedImage);
		console.log(formData);

		try {
			const payloadHeader = await buildToken();
			payloadHeader.headers["Content-Type"] = "multipart/form-data";
			console.log(payloadHeader);
			const res = await axios.post("/users/upload-proof", formData, payloadHeader);
			console.log(res);
			setBusinessId(null);
			setUploadedImage(null);
			// console.log(businessId);
			// console.log(uploadedImage);
			setUploadProof(false);
			setTimeout(() => {
				fetchCustomerDetails();
			}, 2000);
			setLoading(false);
		} catch (e) {
			setUploadProof(false);
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.error ? e.error : e.toString());
			console.log(e);
		}
	};

	if (loading) return <Loading />;

	return (
		<div>
			<DashboardSidebar
				buttons={[
					{ title: "Dashboard", linkTo: "/customer/dashboard" },
					{ title: "Coupons", linkTo: "/customer/coupons" },
					{ title: "Profile", linkTo: "/customer/account" },
				]}
			/>
			<main className="h-full ml-32">
				{uploadProof ? handleUploadProof() : null}
				<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
					<Error message={errorMessage} />
				</CreateModal>
				<CreateModal openModal={receiptView} setOpenModal={setReceiptView}>
					<ImageView imageSrc={receiptViewSrc} />
				</CreateModal>
				<div className="h-[98vh] pt-4 px-4 pb-0 grid grid-cols-1 gap-4">
					<div className="max-w-full col-span-1 p-4 h-full rounded-lg bg-white bg-opacity-40 overflow-y-auto">
						<div className="flex justify-center text-3xl font-medium text-indigo-600 p-2">Proof History</div>
						<span>
							<button
								className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-500 rounded-lg py-2 px-4 text-white"
								onClick={() => {
									setUploadProof(true);
								}}
							>
								Upload Proof
							</button>
						</span>
						<div className="proofList grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
							{renderProofList(customerProofList)}
						</div>
					</div>
				</div>
			</main>
			  
		</div>
	);
};
