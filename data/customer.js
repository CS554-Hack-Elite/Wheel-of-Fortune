// TODO: Add Mongo connection
// const collections = require("../mongoCollections");
// const usersCollection = collections.users;

import { customers } from "../config/mongoCollection.js";
// const customers = mongoCollections.customers;
import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";

const exportedMethods = {
	/**
	 * Sample function to get user details
	 * @returns User Jsom
	 */
	async getCustomerDetails() {
		return {
			name: "customer1",
		};
	},
	async createCustomer(result) {
		const errorObject = {
			status: 400,
		};
		let objKeys = [];
		if (result.google_authenticated && result.google_authenticated == 1) {
			objKeys = ["email", "name"];
		} else {
			objKeys = ["email", "password", "name", "age"];
		}
		objKeys.forEach((element) => {
			helpers.checkInput(element, result[element], element + " of the customer", true);
		});
		if (result.google_authenticated && result.google_authenticated == 1) {
			let hashedPass = await bcrypt.hash(result.password.trim(), saltRounds);
			result.password = hashedPass;
		} else {
			result.password = "";
			result.age = 13;
		}
		const customerCollection = await customers();

		if (result.google_authenticated && result.google_authenticated == 2) {
			let duplicateUser = await customerCollection.findOne({
				email: result.email,
			});
			if (duplicateUser != null) {
				errorObject.error = "Customer with this email already exists.";
				throw errorObject;
			}
		}

		result.coupons = [];
		result.created_at = new Date().toLocaleString();

		const insertInfo = await customerCollection.insertOne(result);
		if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
			errorObject.status = 500;
			errorObject.error = "Could not create customer.";
			throw errorObject;
		}
		const newId = insertInfo.insertedId;
		const newCustomer = await customerCollection.findOne(newId);
		newCustomer._id = newCustomer._id.toString();
		newCustomer = (({ password, ...o }) => o)(newCustomer);
		return newCustomer;
	},
	async getAllCustomers() {
		const errorObject = {
			status: 400,
		};
		const customerCollection = await customers();
		const customerList = await customerCollection.find({}).toArray();
		let objectLength = Object.keys(customerList).length;
		for (let i = 0; i < objectLength; i++) {
			customerList[i]._id = customerList[i]._id.toString();
			customerList[i] = (({ password, ...o }) => o)(customerList[i]);
		}
		return customerList;
	},
};

export default exportedMethods;
