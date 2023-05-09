import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateCoupon } from "./CreateCoupon";
import { GrantPoints } from "./GrantPoints";
import axios from "axios";
import { Loading } from "../Reusables/Loading";
import { Error } from "../Reusables/Error";
import { Button } from "../Reusables/Button";
import { ImageView } from "../Reusables/ImageView";

export const BusinessAdminDashboard = () => {
	const navigate = useNavigate();

	const businessToken = localStorage.getItem("businessAdminToken");
	if (!businessToken) navigate("/admin-login");
	const parsedToken = JSON.parse(businessToken);
	const [business, setBusiness] = useState(parsedToken.businessAdmin);

	// console.log(parsedToken);

	const [openModal, setOpenModal] = useState(false);
	const [pointsModal, setPointsModal] = useState(false);
	const [requests, setRequests] = useState([]);
	const [requestDetails, setRequestDetails] = useState({});
	const [coupons, setCoupons] = useState([]);

	const [openImageModal, setOpenImageModal] = useState(false);
	const [proofImage, setProofImage] = useState("");

	const [loading, setLoading] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	// const [error, setError] = useState(false);

	const [requestsNotFound, setRequestsNotFound] = useState(true);
	const [couponsNotFound, setCouponsNotFound] = useState(true);

	// const buildLocalToken = () => {
	//   const businessToken = localStorage.getItem("businessAdminToken");
	//   console.log(businessToken);
	//   if (!businessToken) navigate("/admin-login");
	//   else {
	//     const parsedToken = JSON.parse(businessToken);
	//     setBusiness(parsedToken.businessAdmin);
	//   }
	// };

	// console.log(business);

	const buildProofs = (customers) => {
		const allProofs = [];

		for (let customer of customers) {
			for (let currentProof of customer.proof) {
				allProofs.push({
					...currentProof,
					customer_name: customer.name,
					customer_email: customer.email,
				});
			}
		}

		return allProofs;
	};

	const getCouponData = async () => {
		try {
			const couponData = await axios.get("business/coupons/" + business.business_id);
			setCoupons(couponData.data.ListOfCoupons);
			console.log(coupons);
			setCouponsNotFound(false);
		} catch (e) {
			setCouponsNotFound(true);
		}
	};

	const getRequestData = async () => {
		try {
			const requestData = await axios.get("/business/get-proof/" + business.business_id);

			setRequests(buildProofs(requestData.data.proof));
			setRequestsNotFound(false);
		} catch (e) {
			setRequestsNotFound(true);
		}
	};

	const getData = async () => {
		setLoading(true);
		await getCouponData();
		await getRequestData();
		setLoading(false);
		// try {
		//   setLoading(true);

		//   const payload = {
		//     business_id: business.businessAdmin.business_id,
		//   };

		//   const requestData = await axios.get(
		//     "/business/get-proof/" + payload.business_id
		//   );

		//   const couponData = await axios.get(
		//     "business/coupons/" + payload.business_id
		//   );

		//   console.log(couponData.data.ListOfCoupons);

		//   setRequests(buildProofs(requestData.data.proof));
		//   setCoupons(couponData.data.ListOfCoupons);

		//   setLoading(false);
		// } catch (e) {
		//   setLoading(false);
		//   setError(true);
		//   // setErrorModal(true);
		//   // setErrorMessage(
		//   //   e && e.response && e.response.data
		//   //     ? e.response.data.message
		//   //     : e.toString()
		//   // );
		// }
	};

	const toggleCouponStatus = async (coupon) => {
		try {
			await axios.get("/business/update-coupon-status/" + business.business_id + "/" + coupon._id);

			getCouponData();
		} catch (e) {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.response && e.response.data ? e.response.data.message : e.toString());
		}
	};

	const assignPoints = (customerRequest) => {
		setPointsModal(true);
		setRequestDetails(customerRequest);
	};

	const logoutAdmin = async () => {
		// TODO: send logout to server
		await axios.get("/admin/logout");

		localStorage.removeItem("adminToken");
		localStorage.removeItem("businessAdminToken");
		navigate("/admin-login");
	};

	const checkStatus = (status, request) => {
		if (status === 1) {
			return (
				<button
					className="px-3 py-2 mr-4 bg-cyan-700 text-white text-lg rounded-lg hover:bg-cyan-600 active:bg-cyan-700 w-full"
					onClick={() => {
						assignPoints(request);
					}}
				>
					Assign Points
				</button>
			);
		} else if (status === 2) {
			return (
				<span className="lg:flex md:hidden ml-auto text-md font-medium w-full">
					<div className="px-3 py-2 mr-4 bg-emerald-700 text-white text-lg rounded-lg w-full text-center hover:cursor-default">Approved</div>
				</span>
			);
		} else {
			return (
				<span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
					<div className="px-3 py-2 mr-10 bg-red-600 hover:bg-red-500 active:bg-red-600 text-white text-lg rounded-lg w-full text-center hover:cursor-pointer">
						Rejected
					</div>
				</span>
			);
		}
	};

	const checkProofExists = (image) => {
		try {
			require("../../../images/proof/" + image);
			return true;
		} catch (error) {
			return false;
		}
	};

	const showProof = (proof) => {
		setProofImage(require("../../../images/proof/" + proof));
		setOpenImageModal(true);
	};

	const buildRequestCard = (request) => {
		console.log(request);
		return (
			<li key={request._id} className="bg-indigo-800 rounded-lg my-3 px-2 py-4 flex items-center">
				<div
					className="w-14 h-14"
					onClick={() => {
						showProof(request.proof);
					}}
				>
					{request.proof && checkProofExists(request.proof) ? (
						<img
							src={require("../../../images/proof/" + request.proof)}
							className="w-full h-14 object-cover rounded-lg hover:pointer"
							alt={request.proof}
						/>
					) : (
						<img
							src="https://placehold.co/320@3x?text=Image+Unavailable&font=open-sans"
							className="w-full h-14 object-cover rounded-lg"
							alt={request.customer_name}
						/>
					)}
				</div>
				<div className="pl-4">
					<div className="text-white font-bold">{request.customer_name}'s Request </div>
					<div className="text-white text-sm">{request.customer_email}</div>
				</div>
				<div className="lg:flex md:hidden ml-auto right-6 text-md font-medium w-40">{checkStatus(request.status, request)}</div>
			</li>
		);
	};

	const renderRequests = () => {
		const allRequest = [];

		for (let request of requests) {
			allRequest.push(buildRequestCard(request));
		}

		return allRequest;
	};

	const couponVisibilityButton = (coupon) => {
		if (coupon.unused_coupon_count) {
			if (coupon.is_display === 2) {
				return (
					<Button
						title="Show Coupon"
						color="indigo"
						clickAction={() => {
							toggleCouponStatus(coupon);
						}}
					/>
				);
			} else {
				return (
					<Button
						title="Hide Coupon"
						color="red"
						clickAction={() => {
							toggleCouponStatus(coupon);
						}}
					/>
				);
			}
		}
	};

	const checkImageExists = (image) => {
		try {
			require("../../../images/coupon_logo/" + image);
			return true;
		} catch (error) {
			return false;
		}
	};

	const buildCouponCard = (coupon) => {
		return (
			<li key={coupon._id} className="bg-indigo-700 rounded-lg my-3 px-2 py-4 flex items-center">
				<div className="w-14 h-14">
					{coupon.image && checkImageExists(coupon.image) ? (
						<img src={require("../../../images/coupon_logo/" + coupon.image)} className="w-full h-14 object-cover rounded-lg hover:pointer" alt="" />
					) : (
						<img src="https://placehold.co/320@3x?text=Image+Unavailable&font=open-sans" className="w-full h-14 object-cover rounded-lg" alt="" />
					)}

					{/* <img
					// src="../public/img/solar.svg"
					// className="text-purple-800 w-[40px]"
					/> */}
				</div>
				<div className="pl-4">
					<p className="text-white font-bold">{coupon.name}</p>
					<p className="text-white text-sm">{coupon.description}</p>
				</div>
				<span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
					{couponVisibilityButton(coupon)}
					<div className="px-3 py-2 mx-4 bg-white bg-opacity-70 text-black text-lg rounded-lg ">
						Available: {coupon.unused_coupon_count}/{coupon.max_allocation}
					</div>
				</span>
			</li>
		);
	};

	const renderCoupons = () => {
		const allCoupons = [];

		for (let coupon of coupons) {
			allCoupons.push(buildCouponCard(coupon));
		}
		return allCoupons;
	};

	useEffect(() => {
		getData();
	}, [business]);

	useEffect(() => {
		if (!pointsModal) getRequestData();
	}, [pointsModal]);

	useEffect(() => {
		if (!openModal) getCouponData();
	}, [openModal]);

	if (loading) return <Loading />;

	// if (error)
	//   return (
	//     <div class="flex flex-col items-center justify-around ">
	//       <Error message={errorMessage} />
	//       <div
	//         class="bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block"
	//         onClick={() => {
	//           logoutAdmin();
	//         }}
	//       >
	//         Logout
	//       </div>
	//     </div>
	//   );

	return (
		<div>
			<div className="flex">
				<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
					<Error message={errorMessage} />
				</CreateModal>

				<CreateModal openModal={openModal} setOpenModal={setOpenModal}>
					<CreateCoupon modalChanged={openModal} businessAdmin={business} />{" "}
				</CreateModal>

				<CreateModal openModal={pointsModal} setOpenModal={setPointsModal}>
					<GrantPoints requestDetails={requestDetails} setOpenModal={setPointsModal} />{" "}
				</CreateModal>

				<CreateModal openModal={openImageModal} setOpenModal={setOpenImageModal}>
					<ImageView imageSrc={proofImage} />
				</CreateModal>
				<div className="fixed w-32 h-screen p-4 bg-white bg-opacity-70 flex flex-col justify-between">
					<div className="flex flex-col items-center">
						{/* <span className="border-b-2 border-gray-200 w-full p-2"></span> */}

						<div
							className="flex justify-center bg-gray-100 w-24 hover:bg-gray-200 cursor-pointer my-4 px-2 py-4 rounded-lg"
							onClick={() => {
								logoutAdmin();
							}}
						>
							{/* <img src="public/img/logout.svg" style="width:20px" /> */}
							Logout
						</div>
					</div>
				</div>
				<main className=" ml-32 w-full">
					<div className="grid lg:grid-cols-3 gap-5 p-4">
						<StastisticsCard
							value={parsedToken && parsedToken.businessData && parsedToken.businessData.name}
							title="Name of the business"
						></StastisticsCard>
						<StastisticsCard value={business.email} title="Email"></StastisticsCard>
					</div>

					<div className="p-4 grid md:grid-cols-4 grid-cols-1 gap-4">
						<div className="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white bg-opacity-40 overflow-y-auto">
							<div className="flex justify-between items-center">
								<div className="text-3xl font-medium text-indigo-600 p-2">Available Coupons</div>
								<div
									className="bg-indigo-600 text-white al p-3 mx-6 rounded-lg inline-block hover:bg-indigo-500 active:bg-indigo-600 hover:cursor-pointer"
									onClick={() => {
										setOpenModal(true);
									}}
								>
									{/* <img src="public/img/logo_white.svg" style="width:20px" /> */}
									Create Coupon
								</div>
							</div>
							{couponsNotFound ? <div class="text-xl text-indigo-600 p-2">Not Found</div> : renderCoupons()}
						</div>
						<div className="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white bg-opacity-40 overflow-y-auto">
							<div className="text-3xl font-medium text-indigo-600 p-2">Customer Requests</div>
							{requestsNotFound ? <div class="text-xl text-indigo-600 p-2">Not Found</div> : renderRequests()}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};
