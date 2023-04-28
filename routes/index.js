import userRoutes from "./users.js";
import adminRoutes from "./Admin.js";

//const bookData = require('../data/books');
const constructorMethod = (app) => {
	app.use("/users/", userRoutes);
	app.use("/admin/", adminRoutes);
	app.use("*", (req, res) => {
		res.status(404).json({ error: "Route not found" });
	});
};

export default constructorMethod;
