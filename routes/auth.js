import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";

import auth from "../config/firebaseConfig.js";

router.route("/login").get(async (req, res) => {
  console.log("login");

  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      console.log(decodeValue);
      // return next();
    }
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

export default router;
