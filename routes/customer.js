import { Router } from "express";
const router = Router();
import { customerData, couponsData, businessData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";
import im from "imagemagick";
import gm from "gm";
import fs from "fs";
import multer from "multer";
import convert from "imagemagick";
import bodyParser from "body-parser";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// Set up multer to handle multipart/form-data
const upload = multer({ storage: storage });

router.route("/get-customer").get(async (req, res) => {
  try {
    let email = req.user && req.user.email ? req.user.email : "";
    const user = await customerData.getCustomerByEmail(email);
    res.status(200).json(user);
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/register").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let result = req.body;
    let objKeys = [];
    if (result.google_authenticated && result.google_authenticated == 1) {
      objKeys = ["email", "name"];
    } else {
      objKeys = ["email", "password", "name", "age"];
    }
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " of the customer",
        true
      );
    });
    const customerRow = await customerData.createCustomer(result);

    return res.status(200).json({ data: customerRow });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/business-list").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    const businessList = await businessData.getBusinessList();
    return res.status(200).json({
      businessData: businessList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/update-points").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let result = req.body;
    let objKeys = [];
    let email = req.user && req.user.email ? req.user.email : "";
    result.email = email;
    objKeys = ["coupon_id", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });

    const updatedCustomerRow = await customerData.updatePoints(result);
    return res.status(200).json({ customer: updatedCustomerRow });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/coupons").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };

    const availableCouponsList = await couponsData.getAvailableCoupons();

    return res.status(200).json({
      availableCoupons: availableCouponsList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/upload-proof").post(upload.single("proof"), async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let result = req.body;
    let objKeys = [];
    let email = req.user && req.user.email ? req.user.email : "";
    result.email = email;
    objKeys = ["business_id", "email"];

    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });

    if (!req.file) {
      console.log("UPLOAD IMAGE");
    }
    gm(req.file.path).write("output.jpg", function (err) {
      if (err) {
        console.log("ERRORR" + err);
      }
    });
    const updatedCustomerRow = await customerData.uploadProof(result);
    return res.status(200).json({ customer: updatedCustomerRow });
  } catch (e) {
    console.log(e);
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

export default router;
