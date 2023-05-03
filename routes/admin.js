import { Router } from "express";
const router = Router();
import helpers from "../helpers/customerHelper.js";
import multer from "multer";
import bcrypt from "bcryptjs";
import * as mongoCollections from "../config/mongoCollection.js";
const admins = mongoCollections.admins;
import { businessData, adminData } from "../data/index.js";

const upload = multer({ dest: "uploads/" });

router.route("/login").post(async (req, res) => {
  console.log("admin login");

  try {
    const { password } = req.body;
    const { email } = req.body;

    // const hash = await bcrypt.hash("IAMADMIN", 1);

    //TODO: Put it in .env file
    //TODO: Check mongo
    //TODO: qweqw
    //TODO: Error Handling
    //TODO: Get info on the new page
    //TODO: Put firebase stuff in .env

    const passwordCompare = await bcrypt.compare(
      password,
      process.env.ADMIN_LOGIN
    );

    if (email !== "SuperAdmin" || !passwordCompare) throw "Error";

    res.status(200).json({ adminAccessKey: "Key1" });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

router.route("/business-login").post(async (req, res) => {
  console.log("business admin login");

  try {
    const { password } = req.body;
    const { email } = req.body;

    console.log(password);
    console.log(email);
    const adminCollection = await admins();
    const adminData = await adminCollection.findOne({
      email: email,
    });
    if (!adminData) throw "No Admin Found";
    console.log(adminData);
    const passwordCompare = await bcrypt.compare(password, adminData.password);
    if (!passwordCompare) throw "Error Unautherized";
    res
      .status(200)
      .json({ businessAdminKey: "Key1", businessAdminEmail: email });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

router.route("/register-business-admin").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
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
    console.log(businessRow);
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
    console.log(e);
    if (
      typeof e === "object" &&
      e !== null &&
      !Array.isArray(e) &&
      "status" in e &&
      "error" in e
    ) {
      return res.status(e.status).json({
        status: e.status,
        message: e.error,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: e.error,
      });
    }
  }
});

export default router;
