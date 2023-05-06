import { Router } from "express";
const router = Router();
import { customerData } from "../data/index.js";
import helpers from "../helpers/customerHelper.js";
import im from "imagemagick";
import gm from "gm";
import fs from "fs";
import multer from "multer";

// Set up multer to handle multipart/form-data
const upload = multer({ dest: "public/images/" });

router.route("/get-customer").get(async (req, res) => {
	try {
		let email = req.user && req.user.email ? req.user.email : "";
		console.log(req.user);
		const user = await customerData.getCustomerByEmail(email);
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
			result[element] = helpers.checkInput(element, result[element], element + " of the customer", true);
		});
		const customerRow = await customerData.createCustomer(result);

		return res.status(200).json({ data: customerRow });
	} catch (e) {
		console.log(e);
		if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
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
		// const errorObject = {
		//   status: 400,
		// };
		// let result = req.body;
		console.log(req.body);
		// let objKeys = [];

		// objKeys = ["business_id", "email"];

		// objKeys.forEach((element) => {
		//   result[element] = helpers.checkInput(
		//     element,
		//     result[element],
		//     element + " for the proof"
		//   );
		// });

		console.log(req.file);
		const fileName = req.file.originalname;
		const fileExtension = fileName.split(".").pop();

		// Define the path where the file will be saved
		const filePath = `/path/to/save/${fileName}`;

		// Read the file and save it to the specified path
		fs.readFile(req.file.path, function (err, data) {
			if (err) throw err;

			// Write the file to the specified path
			fs.writeFile(filePath, data, function (err) {
				if (err) throw err;

				// Perform any ImageMagick operations as required
				im.convert([filePath, "-resize", "50%", filePath], function (err, stdout) {
					if (err) throw err;
					console.log("Image saved successfully");
				});
			});
		});

		// result.proof = filename;
		// const updatedCustomerRow = customerData.uploadProof(result);
		return res.status(200).json({ data: true });
	} catch (e) {
		console.log(e);
		if (typeof e === "object" && e !== null && !Array.isArray(e) && "status" in e && "error" in e) {
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
