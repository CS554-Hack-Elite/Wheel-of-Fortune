import { Router } from "express";
const router = Router();
const AdminData = require("../data/Admin.js/index.js");

router.route("/dashboard")
    .get(async (req, res) => {

      
        

});

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
    const accountData = await AdminData.getAdminById(req.session.admin._id)
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
        admin = await AdminData.getAdminById(req.session.admin._id)
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

      const updatedAdmin = await AdminData.updateAdminAccount(req.session.admin._id, updatedFields, { new: true });
  
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

 
  router.route('/business/list')
  .get(async (req, res) => {
    try {
      const allBusinesses = await AdminData.getAllBusinesses();
      let allBusinessesList = [];
      for (i = 0; i < allBusinesses.length; i++) {
        allBusinessesList.push({ _id: allBusinesses[i]._id, name: allBusinesses[i].name, logo: allBusinesses[i].logo });
      }
      res.json(allBusinessesList);
    } catch (e) {
      res.status(500).json({ error: 'Businesses not found' });
    }
  })
  .delete('/business/delete', async (req, res) => {
    try {
      const id = req.body.id;
      const deletedBusiness = await req.allBusinessesList.findOneAndDelete({ _id: ObjectId(id) });
      if (!deletedBusiness) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json(deletedBusiness);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.route('/customer/list')
  .get(async (req, res) => {
    try {
      const allCustomers = await AdminData.getAllCustomers();
      let allCustomersList = [];
      for (i = 0; i < allCustomers.length; i++) {
        allCustomersList.push({ name: allCustomers[i].name, email: allCustomers[i].email, points: allCustomers[i].points, totalCoupons: allCustomers[i].coupons.length});
      }
      res.json(allCustomersList);
    } catch (e) {
      res.status(500).json({ error: 'Customers not found' });
    }
  })
  
  

module.exports = router;