import { Router } from "express";
const router = Router();

import bcrypt from "bcryptjs";
import * as mongoCollections from "../config/mongoCollection.js";

const admins = mongoCollections.admins;
const adminData = require("../data/admin.js");

router.route("/login").post(async (req, res) => {
  console.log("admin login");

  try {
    const { password } = req.body;
    const { email } = req.body;

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

    if (email !== "SuperAdmin" || !passwordCompare) throw "Error";

    res.status(200).json({ adminAccessKey: "Key1" });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

router.route("/business-login").post(async (req, res) => {
  console.log("business admin login");

  try {
    const { password } = req.body;
    const { email } = req.body;

    console.log(password);
    console.log(email);
    const adminCollection = await admins();
    const adminData = await adminCollection.findOne({
      email: email,
    });

    if (!adminData) throw "No Admin Found";

    console.log(adminData);

    const passwordCompare = await bcrypt.compare(password, adminData.password);

    if (!passwordCompare) throw "Error Unautherized";

    res
      .status(200)
      .json({ businessAdminKey: "Key1", businessAdminEmail: email });
  } catch (e) {
    res.status(400).json({ errorMessage: e });
  }
});

//Master admin account edit feature removed later 
/* 
router.route('/account')
  .get(async (req, res) => {
    try{
        const errorObject = {
            status: 400
        };
        if(!req.session.admin){
            errorObject.status = 401;
            errorObject.error = "Unauthorized Access";
        }
    const accountData = await adminData.getAdminById(req.session.admin._id)
    res.status(200).json(accountData);
    } catch (e) {
        if (
          typeof e === 'object' &&
          e !== null &&
          !Array.isArray(e) &&
          'status' in e &&
          'error' in e
        ) {
          return res.status(e.status).json({
            status: e.status,
            message: e.error,
          });
        } else {
          console.error(e);
          return res.status(404).json({
            status: 404,
            message: e.error,
          });
        }
      }   
  })
  .post(async (req, res) => {
    try {
        const errorObject = {
            status: 400
        };
        if(!req.session.admin){
            errorObject.status = 401;
            errorObject.error = "Unauthorized Access";
        }
        admin = await adminData.getAdminById(req.session.admin._id)
        if(!admin){
            errorObject.status = 401;
            errorObject.error = "No Admin with this id";
        }
        
      if (Object.keys(req.body).length === 0) {
        errorObject.status = 400;
        errorObject.error = "Atlest one field needs to be supplied in the request body";
      }
      let updatedFields = {};

      if (req.body.name && req.body.name !== admin.name) {
        updatedFields.name = req.body.name;
      }

      if (req.body.email && req.body.email !== admin.email) {
        updatedFields.email = req.body.email;
      }
  
      if (req.body.password && req.body.password !== admin.password) {
        updatedFields.password = await bcrypt.hash(req.body.password, 10);
      }

      if (Object.keys(updatedFields).length === 0) {
        errorObject.status = 400;
        errorObject.error = "No fields were updated";
      }

      const updatedAdmin = await adminData.updateAdminAccount(req.session.admin._id, updatedFields, { new: true });
  
      res.status(200).json(updatedAdmin);

    } catch (e) {
        if (
          typeof e === 'object' &&
          e !== null &&
          !Array.isArray(e) &&
          'status' in e &&
          'error' in e
        ) {
          return res.status(e.status).json({
            status: e.status,
            message: e.error,
          });
        } else {
          console.error(e);
          return res.status(500).json({
            status: 500,
            message: e.error,
          });
        }
      }
  });

 */  

export default router;
