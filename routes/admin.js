import { Router } from "express";
const router = Router();

import bcrypt from "bcryptjs";
import * as connection from "../config/mongoCollection.js";
import * as mongoCollections from "../config/mongoCollection.js";
const admins = mongoCollections.admins;

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

export default router;
