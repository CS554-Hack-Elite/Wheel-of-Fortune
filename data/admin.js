import { admins } from "../config/mongoCollection.js";


const exportedMethods = {
    async getBusinessId(admin_id) {
      const errorObject = {
        status: 400
      };
      
      try {
        if (!admin_id || typeof admin_id !== 'string') {
          errorObject.status = 400;
          errorObject.error = 'Invalid admin ID';
          throw errorObject;
        }
        
        const admin = await admins.findOne({ _id: admin_id });
        
        if (!admin) {
          errorObject.status = 404;
          errorObject.error = 'Admin not found';
          throw errorObject;
        }
        
        return admin.business_id;
      } catch (error) {
        errorObject.error = `Failed to get business ID: ${error.message}`;
        throw errorObject;
      }
    }
  };
  

export default exportedMethods;
