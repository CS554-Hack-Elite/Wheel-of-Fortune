import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";

router.route("/").get(async (req, res) => {
  try {
    const user = await userData.getUserDetails();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

export default router;
