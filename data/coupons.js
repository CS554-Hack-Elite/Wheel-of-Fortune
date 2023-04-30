import { coupons } from "../config/mongoCollection.js";


const exportedMethods = {

    async generateCoupons(info) {
        try {
          const errorObject = {
                status: 400
          };
          if (!info || typeof info !== 'object') {
            error.status = 400;
            errorObject.error = 'Invalid coupon information';
          }
          if (!info.name || typeof info.name !== 'string') {
            errorObject.status = 400;
            errorObject.error = 'Invalid coupon name';
          }
          if (!info.description || typeof info.description !== 'string') {
            errorObject.status = 400;
            errorObject.error = 'Invalid coupon description';
          }
          if (!info.image || typeof info.image !== 'string') {
            errorObject.status = 400;
            errorObject.error = 'Invalid image URL';
          }
          if (typeof info.max_allocation !== 'number' || info.max_allocation <= 0) {
            errorObject.status = 400;
            errorObject.error = 'Invalid max allocation';
          }
          if (info.is_display !== 1 && info.is_display !== 2) {
            errorObject.status = 400;
            errorObject.error = 'Invalid display flag';
          }
          // will have to check if business id is present in business data (in route file/here also?)
          if (!info.business_id || typeof info.business_id !== 'string') {
            errorObject.status = 400;
            errorObject.error = 'Invalid business ID';
          }
          const date = date();
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
          _id: ObjectId(),
          code: generateCouponCode(),
          status: 1,
          created_at: date().tolocalestring(),
         });
        }
          
          const coupon = {
            _id: ObjectId(),
            name: info.name,
            description: info.description,
            image: info.image,
            max_allocation: info.max_allocation,
            is_display: info.is_display,
            coupon_codes: codes,
            business_id: info.business_id,
            created_at: date().tolocalestring()
          };
            const couponsCollection = mongoCollection.coupons;
            const result = await couponsCollection.insertOne(coupon);

        if (result.insertedCount !== 1) {
            error.status = 500;
            error.error = 'Could not add coupon';
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

module.exports = {
    exportedMethods
};