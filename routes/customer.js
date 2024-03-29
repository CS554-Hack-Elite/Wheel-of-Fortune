import { Router } from "express";
const router = Router();
import { customerData, couponsData, businessData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";
import fs from "fs";
import { exec } from "child_process";
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});
import os from "os";
const osName = os.platform();

router.route("/get-customer").get(async (req, res) => {
  try {
    let email = req.user && req.user.email ? req.user.email : "";
    if (!(await client.exists("customer-detail-" + email))) {
      const user = await customerData.getCustomerByEmail(email);
      await client.set("customer-detail-" + email, JSON.stringify(user));
      return res.status(200).json(user);
    } else {
      let data = await client.get(`customer-detail-${email}`);
      return res.status(200).json(JSON.parse(data));
    }
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
    if (!result.google_authenticated) {
      errorObject.message = "Please set google_aunthenticated value";
      throw errorObject;
    }
    if (
      result.google_authenticated !== 1 &&
      result.google_authenticated !== 2
    ) {
      errorObject.message = "google_aunthenticated value should be 1 or 2";
      throw errorObject;
    }
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
    await client.set(
      "customer-detail-" + customerRow.email,
      JSON.stringify(customerRow)
    );

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

router.route("/coupon-list").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let email = req.user && req.user.email ? req.user.email : "";
    if (!(await client.exists("customer-coupon-" + email))) {
      const user = await customerData.getCustomerByEmail(email);
      return res.status(200).json({ ListOfCoupons: user.coupons });
    } else {
      let data = await client.get(`customer-coupon-${email}`);
      return res.status(200).json({ ListOfCoupons: JSON.parse(data) });
    }
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
    client.zIncrBy("mostAccessed", 1, result.coupon_id);
    await client.set(
      `customer-detail-${updatedCustomerRow.email}`,
      JSON.stringify(updatedCustomerRow)
    );
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

router.route("/upload-proof").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (!req.files || !req.files.proof) {
      errorObject.message = "Please upload image for proof";
      throw errorObject;
    }

    if (Array.isArray(req.files.proof)) {
      errorObject.message = "Please upload only one image for proof";
      throw errorObject;
    }

    if (
      !req.files.proof.mimetype ||
      (req.files.proof.mimetype !== "image/png" &&
        req.files.proof.mimetype !== "image/jpeg" &&
        req.files.proof.mimetype !== "image/jpg")
    ) {
      errorObject.status = 400;
      errorObject.message = "Image uploaded must be png, jpeg or jpg";
      throw errorObject;
    }
    let result = {};
    let objKeys = [];
    const imageData = req.files.proof.data;
    const outputDirectory = "client/images/proof";
    const outputFileName = Date.now() + "-" + req.files.proof.name;
    const width = 500;

    const outputFilePath = `${outputDirectory}/${outputFileName}`;
    fs.writeFileSync(outputFilePath, imageData);

    let command = "";
    if (osName === "win32") {
      command = `magick  convert "${outputFilePath}" -resize ${width} label:Wheel_of_Fortune -gravity Center -append "${outputFilePath}"`;
    } else {
      command = `convert "${outputFilePath}" -resize ${width} label:Wheel_of_Fortune -gravity Center -append "${outputFilePath}"`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        errorObject.message = `exec error: ${error.toString()}`;
      }
    });

    result = req.body;
    result.proof = outputFileName;
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
    const updatedCustomerRow = await customerData.uploadProof(result);
    await client.set(
      "customer-detail-" + updatedCustomerRow.email,
      JSON.stringify(updatedCustomerRow)
    );
    return res.status(200).json({ customer: updatedCustomerRow });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

export default router;
