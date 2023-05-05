import { Router } from "express";
const router = Router();
import { customerData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";
import { convert, identify } from "imagemagick";
import multer from "multer";
import gm from "gm";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

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

router.route("/upload-proof").post(upload.single("proof"), async (req, res) => {
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

    const filePath = req.file.path;

    // Resize and save the image
    const outputPath = path.join(
      __dirname,
      "uploads",
      "resized",
      req.file.originalname
    );
    gm(filePath)
      .resize(500, 500)
      .write(outputPath, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error resizing image");
        } else {
          console.log("Image saved successfully.");
          // Send a response with the path to the resized image
          const url = `/uploads/resized/${req.file.originalname}`;
          return res.status(200).send({ url });
        }
      });

    // Remove the uploaded file from the server
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Uploaded file removed successfully.");
      }
    });

    // result.proof = filename;
    // const updatedCustomerRow = customerData.uploadProof(result);
    return res.status(200).json({ data: true });
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

export default router;
