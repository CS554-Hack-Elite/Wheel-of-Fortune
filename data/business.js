const mongoCollection = require('../config/mongoCollection');
const business = mongoCollection.business;


const exportedMethods = {

    async createBusiness(){
      
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