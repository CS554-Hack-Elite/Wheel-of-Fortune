import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import { business } from "../config/mongoCollection.js";

const exportedMethods = {
  /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {},
  async createBusiness(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = ["name", "logo"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the business"
      );
    });
    const businessCollection = await business();
    let duplicateUser = await businessCollection.findOne({
      name: result.name,
    });
    if (duplicateUser != null) {
      errorObject.error = "Business with this name already exists.";
      throw errorObject;
    }

    result.created_at = new Date().toLocaleString();
    const insertInfo = await businessCollection.insertOne(result);
    if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
      errorObject.status = 500;
      errorObject.error = "Could not create business.";
      throw errorObject;
    }
    const newId = insertInfo.insertedId;
    let newBusiness = await businessCollection.findOne(newId);
    newBusiness._id = newBusiness._id.toString();
    return newBusiness;
  },
};

export default exportedMethods;
