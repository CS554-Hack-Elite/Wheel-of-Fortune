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

    const business_id = (await adminData.getBusinessId(result.admin_id)).toString();
    result.business_id = business_id;
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
    console.log(e)
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
        !req.session.admin_role ||
        !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
      ) {
        errorObject.status = 403;
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
      !req.session.admin_role ||
      !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
    ) {
      errorObject.status = 403;
      errorObject.error = "Unauthorized Access";
    }
    const businessId = req.params.business_id;
    const deletedBusiness = await businessData.deleteBusinessById(businessId);
    res.status(200).json({ message: "Business deleted successfully", deletedBusiness });
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
        !req.session.admin_role ||
        !req.session.admin_role == process.env.MASTER_ADMIN_ROLE
      ) {
        errorObject.status = 403;
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
