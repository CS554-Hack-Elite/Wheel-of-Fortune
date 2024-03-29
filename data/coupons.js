import { coupons } from "../config/mongoCollection.js";
import { business } from "../config/mongoCollection.js";
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

    let objKeys = ["name", "description", "max_allocation", "business_id"];
    objKeys.forEach((element) => {
      if (element !== "name") {
        result[element] = helpers.checkInput(
          element,
          result[element],
          element + " of the coupon",
          true
        );
      } else {
        result[element] = helpers.checkInput(
          "coupon_name",
          result[element],
          element + " of the coupon",
          true
        );
      }
    });
    let business_id = result.business_id;
    const businessCollection = await business();
    const businessRow = await businessCollection.findOne({
      _id: new ObjectId(business_id),
    });

    if (!businessRow) {
      errorObject.status = 404;
      errorObject.message = `Business with ID ${business_id} not found`;
      throw errorObject;
    }
    const couponsCollection = await coupons();
    let duplicateCoupon = await couponsCollection.findOne({
      name: result.name,
      business_id: business_id,
    });
    if (duplicateCoupon != null) {
      errorObject.message = "Coupon with this name already exists.";
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
      errorObject.message = "Could not add coupon";
    }
    return {
      _id: couponRow.insertedId,
      ...coupon,
    };
  },

  async getCouponsByBusinessId(id) {
    const errorObject = {
      status: 400,
    };

    id = helpers.checkInput("business_id", id, "Invalid Business Id");

    const businessCollection = await business();
    const businessRow = await businessCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!businessRow) {
      errorObject.status = 404;
      errorObject.message = `Business with ID ${id} not found`;
      throw errorObject;
    }
    const couponsCollection = await coupons();
    const couponsList = await couponsCollection
      .find({ business_id: id })
      .toArray();

    const couponsWithCounts = [];

    for (let i = 0; i < couponsList.length; i++) {
      const coupon = couponsList[i];
      const unusedCouponCount = coupon.coupon_codes.filter(
        (code) => code.status === 1
      ).length;
      const couponWithCount = {
        ...coupon,
        unused_coupon_count: unusedCouponCount,
      };
      couponsWithCounts.push(couponWithCount);
    }

    return couponsWithCounts;
  },

  async updateCouponStatus(business_id, coupon_id) {
    const errorObject = {
      status: 400,
    };

    business_id = helpers.checkInput(
      "business_id",
      business_id,
      "Invalid Business ID"
    );
    coupon_id = helpers.checkInput("coupon_id", coupon_id, "Invalid Coupon ID");

    const couponsCollection = await coupons();
    let couponRow = await couponsCollection.findOne({
      business_id: business_id,
      _id: new ObjectId(coupon_id),
    });

    if (!couponRow) {
      errorObject.status = 404;
      errorObject.message = "No coupon with this id found for business";
      throw errorObject;
    }

    if (couponRow.is_display == 2) {
      couponRow = await couponsCollection.findOne({
        business_id: business_id,
        _id: new ObjectId(coupon_id),
        coupon_codes: {
          $elemMatch: {
            status: 1,
          },
        },
      });
      if (!couponRow) {
        errorObject.message =
          "Coupon cannot be displayed as all codes are used";
        throw errorObject;
      }
    }

    await couponsCollection.updateOne(
      { business_id: business_id, _id: new ObjectId(coupon_id) },
      {
        $set: {
          is_display: couponRow.is_display == 1 ? 2 : 1,
        },
      }
    );
    return true;
  },
  async getAllCoupons() {
    const errorObject = {
      status: 400,
      message: "Failed to get coupons",
    };
    const couponsCollection = await coupons();
    const couponsList = await couponsCollection.find({}).toArray();
    return couponsList;
  },

  async getAvailableCoupons() {
    const couponCollection = await coupons();
    const allCoupons = await couponCollection.find({ is_display: 1 }).toArray();
    const couponsWithCodes = [];

    for (const coupon of allCoupons) {
      const count = coupon.coupon_codes.filter(
        (code) => code.status === 1
      ).length;
      if (count >= 1) {
        couponsWithCodes.push({ _id: coupon._id, name: coupon.name });
      }
    }

    if (couponsWithCodes.length > 10) {
      const randomCoupons = [];
      const copyCoupons = couponsWithCodes.slice();
      while (randomCoupons.length < 10) {
        const randomIndex = Math.floor(Math.random() * copyCoupons.length);
        randomCoupons.push(copyCoupons[randomIndex]);
        copyCoupons.splice(randomIndex, 1);
      }
      return randomCoupons;
    } else {
      return couponsWithCodes;
    }
  },

  async getCouponById(id, displayCoupon = false) {
    const errorObject = {
      status: 400,
      message: "Failed to get coupons",
    };
    id = helpers.checkInput("coupon_id", id, "Invalid Coupon Id");
    const couponsCollection = await coupons();
    let coupon = null;
    coupon = await couponsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!coupon) {
      errorObject.status = 404;
      errorObject.message = "Coupon with this ID not found";
      throw errorObject;
    }
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

      if (!coupon) {
        errorObject.status = 400;
        errorObject.message = "Coupon is not displayed";
        throw errorObject;
      }
    }
    return coupon;
  },
};

export default exportedMethods;
