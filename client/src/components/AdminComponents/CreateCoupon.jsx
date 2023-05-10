import React, { useEffect, useState } from "react";
import { FormInput } from "../Reusables/FormInput";
import { Button } from "../Reusables/Button";
import helpers from "../../auth/validation.js";
import axios from "axios";
import { CreateModal } from "../Reusables/CreateModal";
import { Error } from "../Reusables/Error";
import { TimeoutComponent } from "../Reusables/TimeoutComponent";

export const CreateCoupon = ({ modalChanged, businessAdmin }) => {
	const [loading, setLoading] = useState(false);
	const [couponName, setCouponName] = useState("");
	const [couponDescription, setCouponDescription] = useState("");
	const [couponMaxAllocation, setCouponMaxAllocation] = useState(0);
	const [couponImage, setCouponImage] = useState(null);
	const [imageInputValue, setImageInputValue] = useState(false);

	const [showCreated, setShowCreated] = useState(false);

	const [errorModal, setErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const objKeys = ["coupon_name", "description", "max_allocation", "business_id"];

	const createCoupon = async () => {
		try {
			setLoading(true);

			//TODO: Handle image
			const payload = {
				coupon_name: couponName,
				description: couponDescription,
				max_allocation: couponMaxAllocation,
				business_id: businessAdmin.business_id,
			};

			console.log(payload);

			objKeys.forEach((element) => {
				payload[element] = helpers.checkInput(element, payload[element], element + " of the coupon", true);
			});

			console.log(payload);

			const formData = new FormData();
			formData.append("name", payload.coupon_name);
			formData.append("description", payload.description);
			formData.append("max_allocation", payload.max_allocation);
			formData.append("business_id", payload.business_id);
			formData.append("image", couponImage);

			const payloadHeader = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			await axios.post("/business/generate_coupon", formData, payloadHeader);

			setLoading(false);

			setCouponName("");
			setCouponDescription("");
			setCouponMaxAllocation(0);
			setCouponImage(null);
			setImageInputValue(!imageInputValue);

			setShowCreated(true);
		} catch (e) {
			setLoading(false);
			setErrorModal(true);
			setErrorMessage(e && e.response && e.response.data ? e.response.data.message : e.toString());
		}
	};

	useEffect(() => {
		setLoading(false);
		setCouponImage(null);
		setImageInputValue(!imageInputValue);
		setCouponName("");
		setCouponDescription("");
		setCouponMaxAllocation(0);
		setErrorModal(false);
		setErrorMessage("");
	}, [modalChanged]);

	return (
		<div className="flex justify-center h-full">
			<CreateModal openModal={errorModal} setOpenModal={setErrorModal}>
				<Error message={errorMessage} />
			</CreateModal>

			<div className="bg-white flex flex-col w-full md:py-8 my-auto justify-center items-center rounded">
				<div className="text-gray-900 text-lg mb-1 font-medium title-font">Generate A Coupon</div>

				<FormInput title="Coupon Name" type="text" value={couponName} changeAction={setCouponName} />

				<FormInput title="Coupon Description" type="text" value={couponDescription} changeAction={setCouponDescription} />

				<FormInput title="Coupon Max Allocation" type="number" value={couponMaxAllocation} changeAction={setCouponMaxAllocation} />

				<div className="relative mb-4 w-4/5">
					<label htmlFor="couponImage" className="text-xl col-span-1 m-4">
						Coupon
						<input
							className="text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mx-4"
							id="couponImage"
							name="image"
							type="file"
							onChange={(e) => {
								setCouponImage(e.target.files[0]);
							}}
							key={imageInputValue}
							required
						/>
					</label>
				</div>

				{!loading ? (
					<Button title="Create Coupon" clickAction={createCoupon} />
				) : (
					<Button title="Creating...." disabled={true} color="gray" clickAction={createCoupon} />
				)}

				<TimeoutComponent show={showCreated} setShow={setShowCreated}>
					<div className="text-green-700 text-lg mb-1 mt-5 font-medium title-font">Coupon Created!!</div>
				</TimeoutComponent>
			</div>
		</div>
	);
};
