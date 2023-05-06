import { Router } from "express";
const router = Router();
import { businessData } from "../data/index.js";
import { couponsData } from "../data/index.js";
import { customerData } from "../data/index.js";
import { adminData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";

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
      errorObject.error = "Unauthorized Access";

    }
    let result = req.body;

    let objKeys = ["name", "description", "image", "max_allocation", "business_id"];
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
      errorObject.error = "Unauthorized Access";
    }
    
    const couponsList = await couponsData.getAllCoupons();
    return res.status(200).json({
      ListOfCoupons: couponsList,
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
      errorObject.error = "Unauthorized Access";
    }
    const businessId = req.params.business_id;
    const couponsList = await couponsData.getCouponsByBusinessId(businessId);
    return res.status(200).json({
      ListOfCoupons: couponsList,
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
      !req.session.admin_role ||
      !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.error = "Unauthorized Access";
    }

    let result = req.body;

    let objKeys = ["name", "logo"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " of the business",
        true
      );
    });
    businessData = await businessData.createBusiness(result);
    objKeys = ["email", "password", "name", "age"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
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
    return res.status(200).json({
      customer: customerData,
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
      errorObject.error = "Unauthorized Access";
    }
    const businessList = await businessData.getBusinessList();
    return res.status(200).json({
      businessData: businessList,
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
      errorObject.error = "Unauthorized Access";
    }
    let businessId = req.params._id;
    console.log("Business ID:", businessId); // Add a console.log here
    if (!businessId) {
      errorObject.status = 400;
      errorObject.error = "Business ID is required";
      throw errorObject;
    }
    businessId = businessId.toString();
    console.log("Business ID (string):", businessId); // Add a console.log here
    const deletedBusiness = await businessData.deleteBusinessById(businessId);
    console.log("Deleted Business:", deletedBusiness); // Add a console.log here
    res
      .status(200)
      .json({ message: "Business deleted successfully", deletedBusiness });
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
      errorObject.error = "Unauthorized Access";
    }
    const customerList = await customerData.getAllCustomers();
    return res.status(200).json({
      ListOfCustomer: customerList,
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

export default router;
