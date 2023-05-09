import { Router } from "express";
const router = Router();
import { businessData } from "../data/index.js";
import { couponsData } from "../data/index.js";
import { customerData } from "../data/index.js";
import { exec } from "child_process";
import helpers from "../helpers/customerHelper.js";
import redis from "redis";
import fs from "fs";
const client = redis.createClient();
client.connect().then(() => {});

router.route("/generate_coupon").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      !req.session.admin_role == process.env.BUSINESS_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    if (!req.files || !req.files.image) {
      errorObject.message = "Please upload image for coupon";
      throw errorObject;
    }
    const imageData = req.files.image.data; 
    const outputDirectory = "client/images/coupon_logo";
    const outputFileName = Date.now() + "-" + req.files.image.name;
    const width = 200;

    const outputFilePath = `${outputDirectory}/${outputFileName}`;
    fs.writeFileSync(outputFilePath, imageData);

    const command = `magick convert "${outputFilePath}" -resize ${width} "${outputFilePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        errorObject.message = `exec error: ${error}`;
        throw errorObject;
      }
    });
    let result = req.body;
    result.image = outputFileName;
    result.max_allocation = parseInt(result.max_allocation);
    let objKeys = ["name", "description", "max_allocation", "business_id"];
    objKeys.forEach((element) => {
      helpers.checkInput(
        element,
        result[element],
        element + " of the coupon",
        true
      );
    });
    const createdCoupon = await couponsData.generateCoupons(result);
    res.status(201).json(createdCoupon);
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
    if (
      !req.session.admin_role ||
      !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }

    const couponsList = await couponsData.getAllCoupons();
    return res.status(200).json({
      ListOfCoupons: couponsList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/coupons/:business_id").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      !req.session.admin_role == process.env.BUSINESS_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    const businessId = req.params.business_id;
    const couponsList = await couponsData.getCouponsByBusinessId(businessId);
    return res.status(200).json({
      ListOfCoupons: couponsList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/list").get(async (req, res) => {
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

router
  .route("/update-coupon-status/:business_id/:coupon_id")
  .get(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (
        !req.session.admin_role ||
        !req.session.admin_role == process.env.BUSINESS_ADMIN_ROLE
      ) {
        errorObject.status = 403;
        errorObject.message = "Unauthorized Access";
        throw errorObject;
      }
      let business_id = req.params.business_id;
      let coupon_id = req.params.coupon_id;
      business_id = helpers.checkInput(
        "business_id",
        business_id,
        "Invalid Business ID"
      );
      coupon_id = helpers.checkInput(
        "coupon_id",
        coupon_id,
        "Invalid Coupon ID"
      );
      let couponList = await couponsData.updateCouponStatus(
        business_id,
        coupon_id
      );
      const couponsList = await couponsData.getCouponsByBusinessId(business_id);
      return res.status(200).json({
        ListOfCoupons: couponsList,
      });
    } catch (e) {
      res
        .status(e.status ? e.status : 400)
        .json({ message: e.message ? e.message : e });
    }
  });

router.route("/delete/:_id").delete(async (req, res) => {
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
    let businessId = req.params._id;
    if (!businessId) {
      errorObject.status = 400;
      errorObject.message = "Business ID is required";
      throw errorObject;
    }
    businessId = businessId.toString();
    const deletedBusinessDetails = await businessData.deleteBusinessById(
      businessId
    );
    res.status(200).json({
      message: "Business deleted successfully",
      deletedBusinessDetails,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/customer/list").get(async (req, res) => {
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
    const customerList = await customerData.getAllCustomers();
    return res.status(200).json({
      ListOfCustomer: customerList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/get-proof/:business_id").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      req.session.admin_role !== process.env.BUSINESS_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    let business_id = req.params.business_id;
    business_id = helpers.checkInput(
      "business_id",
      business_id,
      "Business ID of the business",
      true
    );

    let proofList = await customerData.getProofByBusiness(business_id);

    return res.status(200).json({
      proof: proofList,
    });
  } catch (e) {
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

router.route("/update-proof").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      req.session.admin_role !== process.env.BUSINESS_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    let result = req.body;
    let objKeys = ["proof_id", "status", "points", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });

    const updatedCustomerRow = await customerData.updateProof(result);
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

router.route("/most-accessed-coupons").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (
      !req.session.admin_role ||
      req.session.admin_role !== process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.message = "Unauthorized Access";
      throw errorObject;
    }
    if (!(await client.exists("mostAccessed"))) {
      return res.status(200).json({ ListOfCoupons: [] });
    } else {
      const topCoupons = await client.zRange("mostAccessed", 0, 9, {
        REV: true,
      });
      let mostAccessedCoupons = [];
      for (let coupon_id of topCoupons) {
        const coupon = await couponsData.getCouponById(coupon_id);
        mostAccessedCoupons.push({
          _id: coupon._id,
          name: coupon.name,
          description: coupon.description,
          image: coupon.image,
          max_allocation: coupon.max_allocation,
          created_at: coupon.created_at,
        });
      }

      return res.status(200).json({ ListOfCoupons: mostAccessedCoupons });
    }
  } catch (e) {
    console.log(e);
    res
      .status(e.status ? e.status : 400)
      .json({ message: e.message ? e.message : e });
  }
});

export default router;
