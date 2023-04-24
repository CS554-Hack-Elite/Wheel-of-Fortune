import { Router } from "express";
const router = Router();
import bcrypt from "bcrypt";

router.route("/login").post(async (req, res) => {
  console.log("admin login");

  try {
    const { password } = req.body;
    const { username } = req.body;

    // const hash = await bcrypt.hash("IAMADMIN", 1);

    //TODO: Put it in .env file
    //TODO: Check mongo
    //TODO: qweqw
    //TODO: Error Handling
    //TODO: Get info on the new page
    //TODO: Put firebase stuff in .env

    const passwordCompare = await bcrypt.compare(
      password,
      process.env.ADMIN_LOGIN
    );

    if (username !== "SuperAdmin" || !passwordCompare) throw "Error";

    res.status(200).json({ adminAccessKey: "Key1" });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

router.route("/business-login").post(async (req, res) => {
  console.log("admin login");

  try {
    const { password } = req.body;
    const { email } = req.body;

    //TODO: Mogog db call to get the requested busineed admin from mongo
    // .findOne(email: email)

    const busineddAdmin = { password: "qweqwe" };

    const passwordCompare = await bcrypt.compare(
      password,
      busineddAdmin.password
    );

    if (!passwordCompare) throw "Error Unautherized";

    res.status(200).json({ adminAccessKey: "Key1" });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

export default router;
