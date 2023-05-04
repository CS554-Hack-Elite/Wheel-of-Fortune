import { business } from "../config/mongoCollection.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import helpers from "../helpers/customerHelper.js";



const exportedMethods = {

    /**
   * Sample function to get user details
   * @returns User Jsom
   */
  async getCustomerDetails() {},
  async createBusiness(result) {
    const errorObject = {
      status: 400,
    };
    let objKeys = ["name", "logo"];
    objKeys.forEach((element) => {
      result[element] = helpers.checkInput(
        element,
        result[element],
        element + " for the business"
      );
    });
    const businessCollection = await business();
    let duplicateUser = await businessCollection.findOne({
      name: result.name,
    });
    if (duplicateUser != null) {
      errorObject.error = "Business with this name already exists.";
      throw errorObject;
    }

    result.created_at = new Date().toLocaleString();
    const insertInfo = await businessCollection.insertOne(result);
    if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
      errorObject.status = 500;
      errorObject.error = "Could not create business.";
      throw errorObject;
    }
    const newId = insertInfo.insertedId;
    let newBusiness = await businessCollection.findOne(newId);
    newBusiness._id = newBusiness._id.toString();
    return newBusiness;
  },
    async getBusinessList() {
      const errorObject = {
        status: 500,
        error: 'Businesses not found'
      };
    
      try {
        const businessCollection = await business();
        const businessList = await businessCollection.find({}).toArray();
        let allBusinessesList = [];
        for (i = 0; i < businessList.length; i++) {
          allBusinessesList.push({ _id: businessList[i]._id, name: businessList[i].name, logo: businessList[i].logo });
        }
        res.json(allBusinessesList);
      } catch (e) {
        console.error(e);
        throw errorObject;
      }
    },

    async getBusinessById(id) {
      const errorObject = {
        status: 400
      };
      
      if (!id || typeof id !== 'string') {
        errorObject.status = 400;
        errorObject.error = 'Invalid business ID';
        throw errorObject;
      }
      
      const businessCollection = await business();
      const businessDoc = await businessCollection.findOne({ _id: ObjectId(id) });
      
      if (!businessDoc) {
        errorObject.status = 404;
        errorObject.error = `Business with ID ${id} not found`;
        throw errorObject;
      }
      
      return businessDoc;
    },  
    
    
    async deleteBusinessById(id) {
      const errorObject = {
        status: 400
      };
      
      try {
        if (!id || typeof id !== 'string') {
          errorObject.status = 400;
          errorObject.error = 'Invalid business ID';
          throw errorObject;
        }
    
        const businessCollection = await business();
        const deletedBusiness = await this.getBusinessById(id);
    
        if (!deletedBusiness) {
          errorObject.status = 404;
          errorObject.error = `Business with ID ${id} not found`;
          throw errorObject;
        }
    
        await businessCollection.deleteOne({ _id: ObjectId(id) });
        return deletedBusiness;
      } catch (err) {
        console.error(err);
        if (!err.status) {
          throw {
            status: 500,
            error: 'Server error'
          };
        }
        throw err;
      }
    }
    

}

export default exportedMethods;

