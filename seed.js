// Seed file to populate the database. It will drop pre-existing database if any and create:
// 5 adult users, 5 minor users.
// 2 jobs per adult user.
// 10 comments.

import * as connection from "./config/mongoConnection.js";
import * as mongoCollections from "./config/mongoCollection.js";
const users = mongoCollections.users;

let firstUser = undefined;

async function main() {
	const db = await connection.dbConnection();

	try {
		const userCollection = await users();
		firstUser = await userCollection.insertOne({
			name: "John Doe",
			username: "john012",
		});
		console.log(firstUser);
	} catch (e) {
		console.log(e);
	}

	await connection.closeConnection();
}

main();
