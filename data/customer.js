// TODO: Add Mongo connection
// const collections = require("../mongoCollections");
// const usersCollection = collections.users;

const exportedMethods = {
	/**
	 * Sample function to get user details
	 * @returns User Jsom
	 */
	async getCustomerDetails() {
		return {
			name: "user1 ",
		};
	},
};

export default exportedMethods;
