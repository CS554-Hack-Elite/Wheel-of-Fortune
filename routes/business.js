import { Router } from "express";
const router = Router();
import {businessData}  from "../data/index.js";
const helpers = require("./../helpers/businessHelper");

router.route("/coupons").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin ||
      !req.session.admin.role_id == process.env.master_admin
    ) {
      errorObject.status = 401;
      errorObject.error = "Unauthorized Access";
    }
  } catch (e) {
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

router.route("/list").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin ||
      !req.session.admin.role_id == process.env.master_admin
    ) {
      errorObject.status = 401;
      errorObject.error = "Unauthorized Access";
    }
    const businessData = await businessData.getBusinessList();
    return res.status(200).json({
      businessData: businessData,
    });
  } catch (e) {
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

router.route("/create").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin ||
      !req.session.admin.role_id == process.env.master_admin
    ) {
      errorObject.status = 401;
      errorObject.error = "Unauthorized Access";
    }

    let result = req.body;

    let objKeys = ["name", "logo"];
    objKeys.forEach((element) => {
      result[element]=helpers.checkInput(
        element,
        result[element],
        element + " of the business",
        true
      );
    });
    businessData = await businessData.createBusiness(result);
    objKeys = ["email", "password", "name", "age"];
    objKeys.forEach((element) => {
      result[element]=helpers.checkInput(
        element,
        result[element],
        element + " of the admin",
        true
      );
      if (element === "age") {
        result[element] = parseInt(result[element]);
      }
    });
    let customerData = await userData.createUser(result);
    res.redirect("/list");
  } catch (e) {
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
