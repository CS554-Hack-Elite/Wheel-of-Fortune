import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Reusables/Button";
import { FormInput } from "./Reusables/FormInput";
import { useAuth } from "../contexts/AuthContext";

export const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [age, setAge] = useState("");

	const { register } = useAuth();

	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const signupCustomer = async () => {
		//TODO: validate creds

		//TODO: put info in DB

		try {
			setLoading(true);
			await register(email, password);
			navigate("/customer/dashboard");
		} catch (e) {
			//TODO: delete user from db
			alert("Failed to register");
		}

		setLoading(false);
	};

	const redirectToLogin = () => {
		navigate("/login");
	};

	return (
		<div className="flex justify-center h-full">
			<div className="lg:w-1/3 md:w-1/2 bg-white bg-opacity-30 flex flex-col w-full my-auto md:py-8 items-center rounded shadow-2xl ">
				<h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Signup</h2>

				<FormInput title="Name" type="text" changeAction={setName} />
				<FormInput title="Age" type="age" changeAction={setAge} />

				<FormInput title="Email" type="email" changeAction={setEmail} />
				<FormInput title="Password" type="password" changeAction={setPassword} />

				<div className="grid lg:grid-row-3 gap-2 mt-4">
					<Button title="Signup" clickAction={signupCustomer} />
					<Button title="Already have an Account" clickAction={redirectToLogin} />
				</div>
			</div>
		</div>
	);
};
