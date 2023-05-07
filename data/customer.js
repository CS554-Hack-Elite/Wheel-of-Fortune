import { customers, coupons } from "../config/mongoCollection.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";
import { businessData, couponsData } from "./index.js";
import { ObjectId } from "mongodb";
import functions from "firebase-functions";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const exportedMethods = {
  /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {
    return "CUSTOMER 1";
  },
  async getCustomerByEmail(email) {
    const errorObject = {
      status: 400,
    };
    const customerCollection = await customers();
    let customerData = await customerCollection.findOne({
      email: email,
    });
    if (!customerData) {
      errorObject.status = 401;
      errorObject.message = "Invalid customer email provided";
      throw errorObject;
    }
    customerData._id = customerData._id.toString();
    customerData = (({ password, ...o }) => o)(customerData);
    return customerData;
  },
  async createCustomer(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = [];
    let duplicateUserRow = false;
    let duplicateUser = null;

    if (result.google_authenticated && result.google_authenticated == 1) {
      objKeys = ["email", "name"];
    } else {
      objKeys = ["email", "password", "name", "age"];
    }
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " of the customer"
      );
    });
    if (result.google_authenticated && result.google_authenticated == 2) {
      let hashedPass = await bcrypt.hash(result.password.trim(), saltRounds);
      result.password = hashedPass;
    } else {
      result.password = "";
      result.age = 13;
    }
    const customerCollection = await customers();
    if (result.google_authenticated && result.google_authenticated == 1) {
      duplicateUser = await customerCollection.findOne({
        email: result.email,
      });

      if (duplicateUser !== null) {
        await customerCollection.updateOne(
          { email: result.email, google_authenticated: 2 },
          { $set: { google_authenticated: 1, password: "" } }
        );
        duplicateUserRow = true;
      }
    }
    duplicateUser = await customerCollection.findOne({
      email: result.email,
      google_authenticated: 2,
    });
    if (duplicateUser != null) {
      errorObject.message = "Customer with this email already exists.";
      throw errorObject;
    }
    result.coupons = [];
    result.points = 0;
    result.proof = [];
    result.created_at = new Date().toLocaleString();
    if (!duplicateUserRow) {
      const insertInfo = await customerCollection.insertOne(result);
      if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
        errorObject.status = 500;
        errorObject.message = "Could not create customer.";
        throw errorObject;
      }
    }
    let newCustomer = await customerCollection.findOne({ email: result.email });
    newCustomer._id = newCustomer._id.toString();
    newCustomer = (({ password, ...o }) => o)(newCustomer);
    return newCustomer;
  },
  async getAllCustomers() {
    const errorObject = {
      status: 400,
    };
    const customerCollection = await customers();
    const customerList = await customerCollection.find({}).toArray();
    let objectLength = Object.keys(customerList).length;
    for (let i = 0; i < objectLength; i++) {
      customerList[i]._id = customerList[i]._id.toString();
      customerList[i] = (({ password, ...o }) => o)(customerList[i]);
    }
    return customerList;
  },

  async uploadProof(result) {
    const errorObject = {
      status: 400,
    };

    // const msg = {
    //   to: "tanay.cybercom@gmail.com",
    //   from: "tanay.cybercom@gmail.com",
    //   subject: "Your Subject",
    //   text: "HELLO",
    //   html: `<p>HELLO</p>`,
    // };

    // await sgMail.send(msg);

    let objKeys = [];
    result.proof = "abc";
    objKeys = ["business_id", "proof", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });
    let customerRow = await this.getCustomerByEmail(result.email);
    let businessRow = await businessData.getBusinessById(result.business_id);
    result.status = 1;
    result.created_at = new Date().toLocaleString();
    result._id = new ObjectId();
    let customerProof = customerRow.proof;
    customerProof.push({
      business_id: result.business_id,
      proof: result.proof,
      _id: result._id,
      status: 1,
      points_earned: 0,
      created_at: result.created_at,
    });
    const customerCollection = await customers();
    await customerCollection.updateOne(
      { email: result.email },
      { $set: { proof: customerProof } }
    );
    return customerRow;
  },
  async updateProof(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = ["proof_id", "status", "points", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the proof"
      );
    });
    const customerCollection = await customers();

    let proofRow = await customerCollection.findOne({
      email: result.email,
      "proof._id": new ObjectId(result.proof_id),
    });
    if (!proofRow) {
      errorObject.message = "Invalid Proof Id provided";
      throw errorObject;
    }
    proofRow = await customerCollection.findOne({
      email: result.email,
      proof: {
        $elemMatch: {
          _id: new ObjectId(result.proof_id),
          status: 1,
        },
      },
    });
    if (!proofRow) {
      errorObject.status = 401;
      errorObject.message = "Can only update proof if status is pending";
      throw errorObject;
    }
    if (result.status == 3) {
      result.points = 0;
    }
    if (result.status === 2 && result.points < 1) {
      errorObject.message = "Should allocate points if status is approved";
      throw errorObject;
    }
    await customerCollection.updateOne(
      { email: result.email, "proof._id": new ObjectId(result.proof_id) },
      {
        $set: {
          "proof.$.status": result.status,
          "proof.$.points_earned": result.points,
        },
        $inc: {
          points: result.points,
        },
      }
    );
    let customerRow = await this.getCustomerByEmail(result.email);
    return customerRow;
  },

  async getProofByBusiness(business_id) {
    const errorObject = {
      status: 400,
    };
    console.log(business_id);
    business_id = helpers.checkInput(
      "business_id",
      business_id,
      "Business ID for the proof"
    );
    let businessRow = await businessData.getBusinessById(business_id);
    const customerCollection = await customers();
    const customerList = await customerCollection
      .find({
        "proof.business_id": business_id,
      })
      .toArray();
    let data = [];
    let proofArray = [];
    customerList.forEach((customerValue) => {
      proofArray = [];
      customerValue.proof.forEach((proofValue) => {
        if (proofValue.business_id == business_id) {
          proofArray.push(proofValue);
        }
      });
      data.push({
        email: customerValue.email,
        name: customerValue.name,
        proof: proofArray,
      });
    });
    return data;
  },

  async updatePoints(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = [];
    objKeys = ["coupon_id", "email"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the coupon"
      );
    });
    let customerRow = await this.getCustomerByEmail(result.email);
    if (customerRow.points < 1) {
      errorObject.status = 401;
      errorObject.message = "Cannot spin the wheel, insufficient points";
      throw errorObject;
    }
    const customerCollection = await customers();
    const couponData = await couponsData.getCouponById(result.coupon_id, true);
    let businessRow = await businessData.getBusinessById(
      couponData.business_id
    );
    const couponsCollection = await coupons();
    let assignCode = "";
    let assignId = null;
    let statusCount = 0;
    let customerCoupons = customerRow.coupons;
    couponData.coupon_codes.forEach((codeValue) => {
      if (codeValue.status == 1) {
        assignCode = codeValue.code;
        assignId = codeValue._id.toString();
        statusCount = statusCount + 1;
      }
    });
    customerCoupons.push({
      _id: new ObjectId(),
      coupon_id: result.coupon_id,
      coupon_code: assignCode,
      created_at: new Date().toLocaleString(),
      coupon_name: couponData.name,
      coupon_description: couponData.description,
      image: couponData.image,
      name: businessRow.name,
      business_image: businessRow.logo,
    });
    await customerCollection.updateOne(
      { email: result.email },
      {
        $set: { coupons: customerCoupons },
        $inc: {
          points: -1,
        },
      }
    );

    await couponsCollection.updateOne(
      {
        _id: new ObjectId(result.coupon_id),
        "coupon_codes._id": new ObjectId(assignId),
      },
      {
        $set: {
          "coupon_codes.$.status": 2,
        },
      }
    );

    if (statusCount == 1) {
      await couponsCollection.updateOne(
        {
          _id: new ObjectId(result.coupon_id),
        },
        {
          $set: {
            is_display: 2,
          },
        }
      );
    }
    customerRow = await this.getCustomerByEmail(result.email);
    return customerRow;
  },
};

export default exportedMethods;
