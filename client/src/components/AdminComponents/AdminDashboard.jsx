import React, { useEffect, useState } from "react";
import { StastisticsCard } from "../Reusables/StastisticsCard";
import { Link, useNavigate } from "react-router-dom";
import { CreateModal } from "../Reusables/CreateModal";
import { CreateBusinessAdmin } from "./CreateBusinessAdmin";
import { clearLocalTokens } from "../../auth/localTokenHandler";
import axios from "axios";
import { Loading } from "../Reusables/Loading";
import { DeleteBusinessConfirmationModal } from "./DeleteBusinessConfirmationModal";
import { Error } from "../Reusables/Error";

export const AdminDashboard = () => {
	const [openModal, setOpenModal] = useState(false);
	const navigate = useNavigate();

	const [coupons, setCoupons] = useState([]);
	const [businesses, setBusinesses] = useState([]);
	const [customers, setCustomers] = useState([]);

	const [selectedBusinessForDeletion, setSelectedBusinessForDeletion] = useState({});
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [loading, setLoading] = useState(true);
	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// individual states

	const [couponsNotFetched, setCouponsNotFetched] = useState(true);
	const [businessesNotFetched, setBusinessesNotFetched] = useState(true);
	const [customersNotFetched, setCustomersNotFetched] = useState(true);

	const getCouponData = async () => {
		try {
			// throw "qweqwe";
			const couponData = await axios.get("/business/most-accessed-coupons/");
			setCoupons(couponData.data.ListOfCoupons);
			setCouponsNotFetched(false);
		} catch (e) {
			setCouponsNotFetched(true);
		}
	};

	const getBusinessData = async () => {
		try {
			// throw "qweqewwqe";
			const businessData = await axios.get("/business/list/");
			setBusinesses(businessData.data.businessData);
			setBusinessesNotFetched(false);
		} catch (e) {
			setBusinessesNotFetched(true);
		}
	};

	const getCustomerData = async () => {
		try {
			// throw "qewqwe";
			const customerData = await axios.get("/business/customer/list");
			setCustomers(customerData.data.ListOfCustomer);
			setCustomersNotFetched(false);
		} catch (e) {
			setCustomersNotFetched(true);
		}
	};

	const getData = async () => {
		setLoading(true);
		await getCouponData();
		await getBusinessData();
		await getCustomerData();
		setLoading(false);
	};

	const deleteBusiness = (business) => {
		setSelectedBusinessForDeletion(business);
		setOpenDeleteModal(true);
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
			<li className="bg-indigo-800 rounded-lg my-3 p-4 flex items-center">
				<div className="w-14 h-14">
					{coupon.image && checkImageExists(coupon.image) ? (
						<img
							src={require("../../../images/coupon_logo/" + coupon.image)}
							className="w-full h-14 object-cover rounded-lg hover:pointer"
							alt={coupon.name}
						/>
					) : (
						<img src="https://placehold.co/320@3x?text=N/A&font=open-sans" className="w-full h-14 object-cover rounded-lg" alt={coupon.name} />
					)}
				</div>
				<div className="pl-4">
					<p className="text-white font-bold">{coupon.name} </p>
					<p className="text-white text-sm">{coupon.description}</p>
				</div>
				<span className="lg:flex md:hidden ml-auto right-6 text-md font-medium">
					<span className="px-3 py-2 bg-slate-800 text-white text-lg rounded-lg ">Max Coupons: {coupon.max_allocation}</span>
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

	const checkBusinessExists = (image) => {
		try {
			require("../../../images/business_logo/" + image);
			return true;
		} catch (error) {
			return false;
		}
	};

	const buildbusinessCard = (business) => {
		return (
			<li className="bg-indigo-800 rounded-lg my-3 p-4 flex items-center">
				<div className="w-14 h-14">
					{business.logo && checkBusinessExists(business.logo) ? (
						<img
							src={require("../../../images/business_logo/" + business.logo)}
							className="w-full h-14 object-cover rounded-lg hover:pointer"
							alt={business.name}
						/>
					) : (
						<img src="https://placehold.co/320@3x?text=N/A&font=open-sans" className="w-full h-14 object-cover rounded-lg" alt={business.name} />
					)}
				</div>
				<div className="pl-4">
					<p className="text-white font-bold">{business.name} </p>
				</div>
				<button
					className="px-3 py-2 bg-red-600 ml-auto text-white text-lg rounded-lg hover:bg-red-700 active:bg-emerald-500"
					onClick={() => {
						deleteBusiness(business);
					}}
				>
					Delete Business
				</button>
			</li>
		);
	};

	const renderbusinesses = () => {
		const allBusinesses = [];

		for (let business of businesses) {
			allBusinesses.push(buildbusinessCard(business));
		}

		return allBusinesses;
	};

	const logoutAdmin = async () => {
		// TODO: send logout to server

		await axios.get("/admin/logout");
		clearLocalTokens();
		navigate("/admin-login");
	};

	useEffect(() => {
		if (!localStorage.getItem("adminToken")) navigate("/admin-login");
		getData();
	}, []);

	useEffect(() => {
		if (!openModal) getBusinessData();
	}, [openModal]);

	useEffect(() => {
		if (!openDeleteModal) getBusinessData();
	}, [openDeleteModal]);

	// if (loading) return <Loading />;

	return (
		<div class="flex">
			<CreateModal openModal={openModal} setOpenModal={setOpenModal}>
				<CreateBusinessAdmin modalChanged={openModal} />{" "}
			</CreateModal>
			<CreateModal openModal={openDeleteModal} setOpenModal={setOpenDeleteModal}>
				<DeleteBusinessConfirmationModal business={selectedBusinessForDeletion} modalChanged={openDeleteModal} setOpenModal={setOpenDeleteModal} />{" "}
			</CreateModal>
			<div class="fixed w-32 h-screen p-4 bg-white bg-opacity-70 flex flex-col justify-between">
				<div class="flex flex-col items-center">
					<button
						class="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 text-white p-3 rounded-lg inline-block"
						onClick={() => {
							setOpenModal(true);
						}}
					>
						{/* <img src="public/img/logo_white.svg" style="width:20px" /> */}
						Create Admin
					</button>

					<span class="border-b-2 border-indigo-600 w-full p-2"></span>

					<button
						class="bg-gray-100 hover:bg-gray-200 my-4 p-3 rounded-lg inline-block"
						onClick={() => {
							logoutAdmin();
						}}
					>
						Logout
					</button>
				</div>
			</div>
			<main class=" ml-32 w-full">
				<div class="grid lg:grid-cols-3 gap-5 p-4">
					<StastisticsCard value={couponsNotFetched ? "Not Found" : coupons.length} title="Number of Coupons"></StastisticsCard>
					<StastisticsCard value={customersNotFetched ? "Not Found" : customers.length} title="Number of Customers"></StastisticsCard>
					<StastisticsCard value={businessesNotFetched ? "Not Found" : businesses.length} title="Number of Businesses"></StastisticsCard>
				</div>

				<div class="p-4 grid md:grid-cols-4 grid-cols-1 gap-4">
					<div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white bg-opacity-40 overflow-y-auto">
						<div class="text-3xl font-medium text-indigo-600 p-2">Top 10 Coupons</div>
						<ul>{couponsNotFetched ? <div class="text-xl text-teal-600 p-2">Not Found</div> : renderCoupons()}</ul>
					</div>
					<div class="md:col-span-2 p-4 lg:h-[80vh] h-[50vh] rounded-lg bg-white bg-opacity-40 overflow-y-auto">
						<div class="text-3xl font-medium text-indigo-600 p-2">Businesses</div>
						<ul>{businessesNotFetched ? <div class="text-xl text-teal-600 p-2">Not Found</div> : renderbusinesses()}</ul>
					</div>
				</div>
			</main>
		</div>
	);
};
