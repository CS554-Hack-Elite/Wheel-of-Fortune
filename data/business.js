const mongoCollection = require('../config/mongoCollection');
const business = mongoCollection.business;



const exportedMethods = {

    async createBusiness(){

    },
    async getBusinessList(){
        try {
            const businessCollection = await business();
            const businessList = await businessCollection.find({}).toArray();
            let allBusinessesList = [];
            for (i = 0; i < businessList.length; i++) {
              allBusinessesList.push({ _id: businessList[i]._id, name: businessList[i].name, logo: businessList[i].logo });
            }
            res.json(allBusinessesList);
          } catch (e) {
            res.status(500).json({ error: 'Businesses not found' });
          }
    },
    async getBusinessById (id) {
        if (!id || typeof id !== 'string') {
          throw { status: 400, error: 'Invalid business ID' };
        }
      
        const businessCollection = await business();
        const businessDoc = await businessCollection.findOne({ _id: ObjectId(id) });
      
        if (!businessDoc) {
          throw { status: 404, error: `Business with ID ${id} not found` };
        }
      
        return businessDoc;
    },
    async deleteBusinessById(id){
        try {
            const businessCollection = await business();
            const deletedBusiness = await this.getBusinessById(id);
            if (!deletedBusiness) {
              throw "Business not found";
            }
            await businessCollection.deleteOne({ _id: ObjectId(id) });
            return deletedBusiness;
          } catch (err) {
            console.error(err);
            throw "Server error";
          }
    }

}

export default exportedMethods;