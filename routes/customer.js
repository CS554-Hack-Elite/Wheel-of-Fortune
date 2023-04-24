import { Router } from "express";
const router = Router();

import * as customerData from "../data/customer.js";
import * as  helpers from "../helpers/customerHelper.js";

router.route("/register").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let result = req.body;
    let objKeys = ["email", "password", "name", "age"];
    objKeys.forEach((element) => {
      helpers.checkInput(
        element,
        result[element],
        element + " of the customer",
        true
      );
    });
    const customerRow = await customerData.createCustomer(result);

    return res.status(200).json({ data: customerRow });
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      !Array.isArray(e) &&
      "status" in e &&
      "error" in e
    ) {
      return res.status(e.status).json({
        error: e.error,
      });
    } else {
      return res.status(400).json({
        error: e,
      });
    }
  }
});

export default router;
