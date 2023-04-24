import { Router } from "express";
const router = Router();
import { customerData } from "../data/index.js";

router.route("/").get(async (req, res) => {
  try {
    const user = await customerData.getCustomerDetails();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});
// const helpers = require("./../helpers/customerHelper");

// router.route("/register").post(async (req, res) => {
//   try {
//     const errorObject = {
//       status: 400,
//     };
//     if (typeof req.body !== "object") {
//       errorObject.error = "Invalid Data Posted.";
//       throw errorObject;
//     }
//     let result = req.body;
//     let objKeys = ["email", "password", "firstName", "lastName", "age"];
//     objKeys.forEach((element) => {
//       helpers.checkInput(
//         element,
//         result[element],
//         element + " of the user",
//         true
//       );
//       if (element === "age") {
//         result[element] = parseInt(result[element]);
//       }
//     });
//     await userData.createUser(result);
//     res.redirect("/login");
//   } catch (e) {
//     if (
//       typeof e === "object" &&
//       e !== null &&
//       !Array.isArray(e) &&
//       "status" in e &&
//       "error" in e
//     ) {
//       return res.status(e.status).render("user/register", {
//         title: "Register",
//         error: e.error,
//         layout: "auth",
//       });
//     } else {
//       return res.status(400).render("user/register", {
//         title: "Register",
//         error: e,
//         layout: "auth",
//       });
//     }
//   }
// });

export default router;
