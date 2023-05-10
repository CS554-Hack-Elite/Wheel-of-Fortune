import { Router } from "express";
const router = Router();

import auth from "../config/firebaseConfig.js";

router.route("/login").get(async (req, res) => { 
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
    }
  } catch (e) {
    res
    .status(e.status ? e.status : 400)
    .json({ message: e.message ? e.message : e });
  }
});

export default router;
