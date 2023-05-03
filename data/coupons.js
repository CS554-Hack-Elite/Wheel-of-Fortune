import { coupons } from '../config/mongoCollection';
import { ObjectId } from 'mongodb';

const exportedMethods = {

    async generateCoupons(result) {
        try {
          const errorObject = {
                status: 400
          };
          
          let objKeys = ["name", "description", "image", "max_allocation", "business_id"];
          objKeys.forEach((element) => {
          result[element] = helpers.checkInput(
            element,
            result[element],
            element + " for the coupons"
          );
          });
          const date = new Date();
          const codes = [];

          function generateCouponCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 10; i++) {
              result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
          }

        for (let i = 0; i < info.max_allocation; i++) {
          codes.push({
          _id: new ObjectID(),
          code: generateCouponCode(),
          status: 1,
          created_at: date.tolocalestring(),
         });
        }
          
          const coupon = {
            _id: ObjectId(),
            name: info.name,
            description: info.description,
            image: info.image,
            max_allocation: info.max_allocation,
            is_display: 1,
            coupon_codes: codes,
            business_id: info.business_id,
            created_at: date.tolocalestring()
          };
            const couponsCollection = _coupons;
            const result = await couponsCollection.insertOne(coupon);

        if (result.insertedCount !== 1) {
            errorObject.status = 500;
            errorObject.error = 'Could not add coupon';
        }
  
        return coupon;

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
      },

      async getAllCoupons() {
        try {
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
      }
      

};

export default {
    exportedMethods
};