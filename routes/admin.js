import { Router } from "express";
const router = Router();
import helpers from "../helpers/customerHelper.js";
import bcrypt from "bcryptjs";
import * as mongoCollections from "../config/mongoCollection.js";

const admins = mongoCollections.admins;
import { businessData, adminData } from "../data/index.js";
import session from "express-session";

router.route("/login").post(async (req, res) => {
  try {
    let result = req.body;
    let objKeys = ["email", "password"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the admin"
      );
    });
    const adminRow = await adminData.checkAdmin(
      result,
      process.env.MASTER_ADMIN_ROLE
    );
    req.session.admin = adminRow;
    req.session.admin_role = process.env.MASTER_ADMIN_ROLE;
    res.status(200).json({ adminAccessKey: "Key1" });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/business-login").post(async (req, res) => {
  try {
    let result = req.body;
    let objKeys = ["email", "password"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the admin"
      );
    });
    const adminRow = await adminData.checkAdmin(result);
    const businessRow = await businessData.getBusinessById(adminRow.business_id);
    req.session.admin = adminRow;
    req.session.admin_role = process.env.BUSINESS_ADMIN_ROLE;
    res.status(200).json({
      businessAdminKey: "Key1",
      businessAdmin: adminRow,
      businessData: businessRow,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/register-business-admin").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    let result = req.body;
    let objKeys = ["email", "password", "name", "logo"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the business"
      );
    });
    const businessRow = await businessData.createBusiness({
      name: result.name,
      logo: result.logo,
    });
    const adminRow = await adminData.createAdmin({
      email: result.email,
      password: result.password,
      business_id: businessRow._id,
    });
    return res.status(200).json({
      business: businessRow,
      admin: adminRow,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/logout").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    req.session.destroy();
    res.status(200).json({ success: "user Logged out successfully" });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

export default router;
