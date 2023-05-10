import { Router } from "express";
const router = Router();
import helpers from "../helpers/customerHelper.js";
import fs from "fs";
import { exec } from "child_process";
import os from "os";
const osName = os.platform();
import { businessData, adminData } from "../data/index.js";

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
    const businessRow = await businessData.getBusinessById(
      adminRow.business_id
    );
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
    if (
      !req.session.admin_role ||
      !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    if (!req.files || !req.files.logo) {
      errorObject.message = "Please upload logo for business";
      throw errorObject;
    }

    if (!req.files || !req.files.logo) {
      errorObject.message = "Please upload logo for business";
      throw errorObject;
    }
    if (Array.isArray(req.files.logo)) {
      errorObject.message = "Please upload only one logo for business";
      throw errorObject;
    }

    if (
      !req.files.logo.mimetype ||
      (req.files.logo.mimetype !== "image/png" &&
        req.files.logo.mimetype !== "image/jpeg" &&
        req.files.logo.mimetype !== "image/jpg")
    ) {
      errorObject.status = 400;
      errorObject.message = "Logo uploaded must be png, jpeg or jpg";
      throw errorObject;
    }
    const imageData = req.files.logo.data;
    const outputDirectory = "client/images/business_logo";
    const outputFileName = Date.now() + "-" + req.files.logo.name;
    const width = 200;
    const outputFilePath = `${outputDirectory}/${outputFileName}`;
    fs.writeFileSync(outputFilePath, imageData);
    let command = "";
    if (osName === "win32") {
      command = `magick convert "${outputFilePath}" -resize ${width} "${outputFilePath}"`;
    } else {
      command = `convert "${outputFilePath}" -resize ${width} "${outputFilePath}"`;
    }
    exec(command, (error, stdout, stderr) => {
      if (error) {
        errorObject.message = `exec error: ${error}`;
        throw errorObject;
      }
    });
    let result = req.body;
    result.logo = outputFileName;
    let objKeys = ["email", "password", "name"];
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
