import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import { business } from "../config/mongoCollection.js";
import { admins } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";

const exportedMethods = {
  /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {},
  async checkAdmin(result, role) {
    const errorObject = {
      status: 400,
    };
    let objKeys = ["email", "password"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the admin"
      );
    });
    if (role == process.env.MASTER_ADMIN_ROLE) {
      const passwordCompare = await bcrypt.compare(
        password,
        process.env.ADMIN_LOGIN
      );

      if (email !== process.env.ADMIN_LOGIN_EMAIL || !passwordCompare) {
        errorObject.status = 401;
        errorObject.error = "Invalid Credentials for Master Admin";
        throw errorObject;
      }
      return {};
    }
    const adminCollection = await admins();
    const adminData = await adminCollection.findOne({
      email: result.email,
    });
    if (!adminData) {
      errorObject.status = 401;
      errorObject.error = "Invalid business email provided for login";
      throw errorObject;
    }
    const passwordCompare = await bcrypt.compare(password, result.password);
    if (!passwordCompare) {
      errorObject.status = 401;
      errorObject.error = "Invalid password provided for login";
      throw errorObject;
    }
    
    adminData._id = adminData._id.toString();
    adminData = (({ password, ...o }) => o)(adminData);
    return adminData;
  },
  async createAdmin(result) {
    const errorObject = {
      status: 400,
    };
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
      const businessCollection = await business();
      businessCollection.deleteOne({
        _id: new ObjectId(result.business_id),
      });
      errorObject.error = "Admin with this email already exists.";
      throw errorObject;
    }
    result.password = hashedPass;
    result.role_id = process.env.BUSINESS_ADMIN_ROLE;
    result.created_at = new Date().toLocaleString();
    const insertInfo = await adminCollection.insertOne(result);
    if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
      errorObject.status = 500;
      errorObject.error = "Could not create admin.";
      throw errorObject;
    }
    const newId = insertInfo.insertedId;
    let newCustomer = await adminCollection.findOne(newId);
    newCustomer._id = newCustomer._id.toString();
    newCustomer = (({ password, ...o }) => o)(newCustomer);
    return newCustomer;
  },


  async getBusinessId(admin_id) {
    const errorObject = {
      status: 400
    };
    
      if (!admin_id || typeof admin_id !== 'string') {
        errorObject.status = 400;
        errorObject.error = 'Invalid admin ID';
        throw errorObject;
      }
      const adminCollection = await admins();
      let admin = await adminCollection.findOne({
        _id: new ObjectId(admin_id),
      });
      
      if (!admin) {
        errorObject.status = 404;
        errorObject.error = 'Admin not found';
        throw errorObject;
      }
      const businessId = admin.business_id;
      return businessId;
      
    
  }
};

export default exportedMethods;