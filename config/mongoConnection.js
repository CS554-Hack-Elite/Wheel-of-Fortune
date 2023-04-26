import { MongoClient, ServerApiVersion } from "mongodb";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    const mongoClient = new MongoClient(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    _connection = await mongoClient.connect();
    _db = await _connection.db(process.env.DATABASE);
  }

  return _db;
};

const closeConnection = () => {
  _connection.close();
};

export { dbConnection, closeConnection };
