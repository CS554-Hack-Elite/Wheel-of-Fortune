import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import { admins } from "../config/mongoCollection.js";

const exportedMethods = {
  /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {},
  async createAdmin(result) {
    let objKeys = ["email", "password", "business_id"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the business"
      );
    });

    let hashedPass = await bcrypt.hash(result.password.trim(), saltRounds);
    const adminCollection = await admins();
    let duplicateUser = await adminCollection.findOne({
      email: result.email,
    });
    if (duplicateUser != null) {
      errorObject.error = "Admin with this email already exists.";
      throw errorObject;
    }
    result.password = hashedPass;
    result.created_at = new Date().toLocaleString();
    const insertInfo = await adminCollection.insertOne(result);
    if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
      errorObject.status = 500;
      errorObject.error = "Could not create admin.";
      throw errorObject;
    }
    const newId = insertInfo.insertedId;
    let newCustomer = await customerCollection.findOne(newId);
    newCustomer._id = newCustomer._id.toString();
    newCustomer = (({ password, ...o }) => o)(newCustomer);
    return newCustomer;
  },
};

export default exportedMethods;
