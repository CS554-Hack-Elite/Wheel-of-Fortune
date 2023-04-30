import * as dbConnection from "./mongoConnection.js";

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this */
let getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

const customers = getCollectionFn("customers");
const admins = getCollectionFn("admins");
const coupons = getCollectionFn("coupons");
const business = getCollectionFn("business");

/* Now, you can list your collections here: */
export { 
  customers,
  admins,
  coupons,
  business
 };
