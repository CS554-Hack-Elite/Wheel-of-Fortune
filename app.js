import express from "express";
const app = express();
import configRoutes from "./routes/index.js";

configRoutes(app);

app.use(express.json());

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:4000");
});
