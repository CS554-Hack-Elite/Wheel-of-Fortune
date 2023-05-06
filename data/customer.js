import { customers } from "../config/mongoCollection.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import * as businessData from "./business.js";
import { ObjectId } from "mongodb";

const exportedMethods = {
  /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {
    return "CUSTOMER 1";
  },
  async getCustomerByEmail(email) {
    const errorObject = {
      status: 400,
    };
    const customerCollection = await customers();
    let customerData = await customerCollection.findOne({
      email: email,
    });
    if (!customerData) {
      errorObject.status = 401;
      errorObject.error = "Invalid customer email provided";
      throw errorObject;
    }
    customerData._id = customerData._id.toString();
    customerData = (({ password, ...o }) => o)(customerData);
    return customerData;
  },
  async createCustomer(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = [];
    let duplicateUserRow = false;
    let duplicateUser = null;

    if (result.google_authenticated && result.google_authenticated == 1) {
      objKeys = ["email", "name"];
    } else {
      objKeys = ["email", "password", "name", "age"];
    }
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " of the customer"
      );
    });
    if (result.google_authenticated && result.google_authenticated == 2) {
      let hashedPass = await bcrypt.hash(result.password.trim(), saltRounds);
      result.password = hashedPass;
    } else {
      result.password = "";
      result.age = 13;
    }
    const customerCollection = await customers();
    if (result.google_authenticated && result.google_authenticated == 1) {
      duplicateUser = await customerCollection.findOne({
        email: result.email,
      });

      if (duplicateUser !== null) {
        await customerCollection.updateOne(
          { email: result.email, google_authenticated: 2 },
          { $set: { google_authenticated: 1, password: "" } }
        );
        duplicateUserRow = true;
      }
    }
    duplicateUser = await customerCollection.findOne({
      email: result.email,
      google_authenticated: 2,
    });
    if (duplicateUser != null) {
      errorObject.error = "Customer with this email already exists.";
      throw errorObject;
    }
    result.coupons = [];
    result.points = 0;
    result.proof = [];
    result.created_at = new Date().toLocaleString();
    if (!duplicateUserRow) {
      const insertInfo = await customerCollection.insertOne(result);
      if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
        errorObject.status = 500;
        errorObject.error = "Could not create customer.";
        throw errorObject;
      }
    }
    let newCustomer = await customerCollection.findOne({ email: result.email });
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

  async uploadProof(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = [];
    let email = req.email ? req.email : "";
    req.email = email;
    objKeys = ["business_id", "proof", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });
    let customerRow = this.getCustomerByEmail(result.email);
    let businessRow = businessData.getBusinessById(result.business_id);
    result.status = 1;
    result.created_at = new Date().toLocaleString();
    result.proof = "abc";
    result._id = new ObjectId();
    let customerProof = customerRow.proof;
    customerProof = customerProof.push(result);
    customerRow.updateOne({ $set: { proof: customerProof } });
    return customerRow;
  },
  async updateProof(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = [];
    objKeys = ["proof_id", "status", "points"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });
  },
};

export default exportedMethods;
