import { coupons } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import helpers from "../helpers/customerHelper.js";

const exportedMethods = {
  async generateCouponCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  },

  async generateCoupons(result) {
    const errorObject = {
      status: 400,
    };

    let objKeys = [
      "name",
      "description",
      "image",
      "max_allocation",
      "business_id",
    ];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the coupons"
      );
    });
    const couponsCollection = await coupons();
    let duplicateCoupon = await couponsCollection.findOne({
      name: result.name,
    });
    if (duplicateCoupon != null) {
      errorObject.error = "Coupon with this name already exists.";
      throw errorObject;
    }
    const date = new Date();
    const codes = [];

    for (let i = 0; i < result.max_allocation; i++) {
      codes.push({
        _id: new ObjectId(),
        code: await this.generateCouponCode(),
        status: 1,
        created_at: new Date().toLocaleString(),
      });
    }

    //console.log(codes);

    const coupon = {
      _id: new ObjectId(),
      name: result.name,
      description: result.description,
      image: result.image,
      max_allocation: result.max_allocation,
      is_display: 1,
      coupon_codes: codes,
      business_id: result.business_id,
      created_at: new Date().toLocaleString(),
    };

    const couponRow = await couponsCollection.insertOne(coupon);

    if (couponRow.insertedCount !== 1) {
      errorObject.status = 500;
      errorObject.error = "Could not add coupon";
    }
    return {
      _id: couponRow.insertedId,
      ...coupon,
    };
  },

  //function of fetch all coupons for a particular business
  async getCouponsByBusinessId(businessId) {
    const errorObject = {
      status: 400,
      message: "Failed to get coupons",
    };
    const couponsCollection = await coupons();
    const couponsList = await couponsCollection
      .find({ business_id: businessId })
      .toArray();
    if (!couponsList || couponsList.length === 0) {
      errorObject.message = "No coupons found for this business";
      throw errorObject;
    }
    return couponsList;
  },

  async getAllCoupons() {
   
      const errorObject = {
        status: 400,
        message: 'Failed to get coupons'
      };
      const couponsCollection = await coupons();
      const couponsList = await couponsCollection.find({}).toArray();
      if (!couponsList) {
        errorObject.message = 'No coupons found';
        throw errorObject;
      }
      return couponsList;
    },

    async getAvailableCoupons() {
      const couponCollection = await coupons();
      const allCoupons = await couponCollection.find({ is_display: 1 }).toArray();
      const couponsWithCodes = [];
    
      for (const coupon of allCoupons) {
        const count = coupon.coupon_codes.filter((code) => code.status === 1).length;
        if (count >= 1) {
          couponsWithCodes.push(coupon);
        }
      }
    
      return couponsWithCodes;
  },

  async getCouponById(id, displayCoupon = false) {
    const errorObject = {
      status: 400,
      message: "Failed to get coupons",
    };
    let objKeys = ["coupon_id"];
    id = helpers.checkInput("coupon_id", id, "Invalid Coupon Id");
    const couponsCollection = await coupons();
    let coupon = null;
    if (displayCoupon) {
      coupon = await couponsCollection.findOne({
        _id: new ObjectId(id),
        is_display: 1,
        coupon_codes: {
          $elemMatch: {
            status: 1,
          },
        },
      });
    } else {
      coupon = await couponsCollection.findOne({
        _id: new ObjectId(id),
      });
    }
    if (!coupon) {
      errorObject.error = "Invalid Coupon Id provided";
      throw errorObject;
    }
    return coupon;
  },
};

export default exportedMethods;
