import customerDataFunctions from "./customer.js";
const customerData = customerDataFunctions;
const couponsData = require('./coupons.js');

module.exports = {
    coupons: couponsData,
    customer: customerData,
    business: businessData
  };



