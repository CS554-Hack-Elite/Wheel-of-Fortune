import { business } from "../config/mongoCollection.js";
import { admins } from "../config/mongoCollection.js";
import { coupons } from "../config/mongoCollection.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import { ObjectId } from 'mongodb';



const exportedMethods = {

  /**
 * Sample function to get user details
 * @returns User Jsom
 */
  async getCustomerDetails() { },
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

  async getBusinessList() {
    const errorObject = {
      status: 400,
      message: 'Failed to get businesses'
    };
    const businessCollection = await business();
    const businessList = await businessCollection.find({}).toArray();
    if (!businessList || businessList.length === 0) {
      errorObject.message = 'No businesses found';
      throw errorObject;
    }
    return businessList;
  },

  async getBusinessById(id) {
    const errorObject = {
      status: 400
    };

    const businessCollection = await business();
    const businessDoc = await businessCollection.findOne({ _id: new ObjectId(id) });
    if (!businessDoc) {
      errorObject.status = 404;
      errorObject.error = `Business with ID ${id} not found`;
      throw errorObject;
    }
    return businessDoc;
  },

  async deleteBusinessById(id) {
    const businessCollection = await business();
    const adminCollection = await admins();
    const couponsCollection = await coupons();

    const deletedBusiness = await this.getBusinessById(id);

    if (!deletedBusiness) {
      const errorObject = {
        status: 404,
        error: `Business with ID ${id} not found`,
      };
      throw errorObject;
    }

    const adminToDelete = await adminCollection.findOne({
      business_id: id,
    });

    if (adminToDelete) {
      await adminCollection.deleteOne({ business_id: id });
    }
    
    await couponsCollection.updateMany(
      { business_id: id },
      { $set: { is_display: 2 } }
    );

    await businessCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedBusiness;
  }

}

export default exportedMethods;

