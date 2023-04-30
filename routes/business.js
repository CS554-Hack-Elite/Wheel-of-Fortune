import { Router } from "express";
const router = Router();
import { businessData } from "../data/business.js";
import { couponsData } from "../data/coupons.js";
import { customerData } from "../data/customer.js";
const helpers = require("./../helpers/businessHelper");

router.route("/generate_coupon").get(async (req, res) => {
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
    const { name, description, image, max_allocation, is_display, business_id } = req.body;
    
    if (!name || typeof name !== 'string') {
      errorObject.status = 400;
      errorObject.error = 'Invalid coupon name';
    }
    if (!description || typeof description !== 'string') {
      errorObject.status = 400;
      errorObject.error = 'Invalid coupon description';
    }
    if (!image || typeof image !== 'string') {
      errorObject.status = 400;
      errorObject.error = 'Invalid image URL';
    }
    if (!max_allocation || typeof max_allocation !== 'number' || max_allocation <= 0) {
      errorObject.status = 400;
      errorObject.error = 'Invalid max allocation';
    }
    if (!is_display || is_display !== 1 && is_display !== 2) {
      errorObject.status = 400;
      errorObject.error = 'Invalid display flag';
    }
    
    const businessList = await businessData.getBusinessList();
    if (!businessList.some(business => business._id === business_id)) {
      errorObject.status = 400;
      errorObject.error = 'No such Business ID exists';
    }

    if (!business_id || typeof business_id !== 'string') {
      errorObject.status = 400;
      errorObject.error = 'Invalid business ID';
    }

    const couponInfo = {
      name,
      description,
      image,
      max_allocation,
      is_display,
      business_id
    };
    const createdCoupon = await couponsData.generateCoupons(couponInfo);
    res.status(201).json(createdCoupon);
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
    const couponsData = couponsData.getAllCoupons();
    return res.status(200).json({
      couponsData: couponsData,
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
})

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
      helpers.checkInput(
        element,
        result[element],
        element + " of the business",
        true
      );
    });
    businessData = await businessData.createBusiness(result);
    objKeys = ["email", "password", "name", "age"];
    objKeys.forEach((element) => {
      helpers.checkInput(
        element,
        result[element],
        element + " of the admin",
        true
      );
      if (element === "age") {
        result[element] = parseInt(result[element]);
      }
    });
    let customerInfo = await userData.createUser(result);
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


router.route("/list")
.get(async (req, res) => {
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
})

router.route("/delete").delete(async (req, res) => {
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
      throw errorObject;
    }
    const businessId = req.params.business_id;
    const businessList = await businessData.getBusinessList();
    const matchingBusiness = businessList.find(
      (business) => business._id === businessId
    );
    if (!matchingBusiness) {
      errorObject.status = 404;
      errorObject.error = "Business not found";
      throw errorObject;
    }
    await businessData.deleteBusinessById(businessId);
    res.status(200).json({ message: "Business deleted successfully" });
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



router.route('/customer/list')
.get(async (req, res) => {
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
    const customerData = await customerData.getAllCustomers();
    return res.status(200).json({
      customerData: customerData,
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
