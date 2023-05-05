import { Router } from "express";
const router = Router();
import { customerData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";
import { convert } from "imagemagick";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

router.route("/").get(async (req, res) => {
  try {
    const user = await customerData.getCustomerDetails();
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json({ errorMessage: e });
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
    console.log(e);
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

router.route("/upload-proof").post(upload.single("file"), async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    let result = req.body;
    let objKeys = [];

    objKeys = ["business_id", "email"];

    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });
    const { path, filename } = req.file;
    try {
      console.log("HELLO");
      const { path, filename } = req.file;
      await convert(path, ["-resize", "200x200", `uploads/${filename}`]);
      res.send("Image uploaded successfully");
    } catch (error) {
      errorObject.status = 500;
      errorObject.error = "Error saving image";
      throw errorObject;
    }
    result.proof = filename;
    return res.status(200).json({ data: true });
    const updatedCustomerRow = customerData.uploadProof(result);
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
